import { useState, useEffect, useRef } from 'react';
import { StellarWallet, NetworkType } from '@qastra/core';
import { Html5Qrcode } from 'html5-qrcode';

/**
 * Main App Component for Qastra Wallet Extension
 * 
 * Features:
 * - Multi-account Stellar wallet management
 * - QR code payment scanning
 * - Network switching (Testnet/Mainnet)
 * - XLM transactions with status tracking
 * - Testnet account funding
 */
function App() {
  // Account and wallet state
  const [accounts, setAccounts] = useState<any[]>([]);
  const [network, setNetwork] = useState<NetworkType>(NetworkType.TESTNET);
  const [loading, setLoading] = useState(true);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [activeAccountIndex, setActiveAccountIndex] = useState(0);
  
  // Modal and UI state
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAccountList, setShowAccountList] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showTransactionStatus, setShowTransactionStatus] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  
  // Account management state
  const [importSecret, setImportSecret] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  // Transaction state
  const [sendFrom, setSendFrom] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendMemo, setSendMemo] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isPayMode, setIsPayMode] = useState(false); // True when opened via QR scan
  const [transactionResult, setTransactionResult] = useState<{
    status: 'sending' | 'success' | 'error';
    hash?: string;
    message?: string;
  } | null>(null);
  
  // QR Scanner state
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  // Load wallet data from Chrome storage on mount
  useEffect(() => {
    chrome.storage.local.get(['wallet', 'network'], (result) => {
      console.log('Loading from storage:', result);
      if (result.wallet) {
        setAccounts(result.wallet.accounts || []);
        setActiveAccountIndex(result.wallet.activeAccountIndex || 0);
      }
      if (result.network) {
        setNetwork(result.network);
      }
      setLoading(false);
    });
  }, []);

  // Load balances for all accounts - only on mount and network change
  useEffect(() => {
    if (accounts.length > 0 && !loading) {
      loadBalances();
    }
  }, [network]);

  const loadBalances = async () => {
    if (accounts.length === 0) return;
    
    setLoadingBalance(true);
    
    // Add a small delay to ensure network state is updated
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const wallet = new StellarWallet({ network });
    
    console.log('Loading balances for accounts:', accounts);
    
    const updatedAccounts = await Promise.all(
      accounts.map(async (account) => {
        try {
          const details = await wallet.getAccountDetails(account.publicKey);
          const xlmBalance = details.balances.find(
            (b: any) => b.asset_type === 'native'
          );
          return {
            publicKey: account.publicKey,
            name: account.name || 'Unnamed Account',
            balance: xlmBalance ? parseFloat(xlmBalance.balance).toFixed(2) : '0.00',
          };
        } catch (error: any) {
          // Account not funded yet or doesn't exist
          console.log('Account not funded:', account.publicKey, error.response?.status);
          // Keep existing account data, just update balance to 0
          return { 
            publicKey: account.publicKey,
            name: account.name || 'Unnamed Account',
            balance: '0.00' 
          };
        }
      })
    );

    console.log('Updated accounts after balance load:', updatedAccounts);
    setAccounts(updatedAccounts);
    
    // Save updated accounts to storage
    chrome.storage.local.get(['wallet'], (result) => {
      if (result.wallet) {
        const updatedWallet = {
          ...result.wallet,
          accounts: updatedAccounts,
        };
        console.log('Saving to storage:', updatedWallet);
        chrome.storage.local.set({ wallet: updatedWallet });
      }
    });
    
    setLoadingBalance(false);
  };

  const startQRScanner = async () => {
    setShowQRScanner(true);
    
    // Get available cameras
    try {
      const devices = await Html5Qrcode.getCameras();
      setCameras(devices);
      if (devices.length > 0) {
        setSelectedCamera(devices[0].id);
      }
    } catch (err) {
      console.error("Failed to get cameras:", err);
    }
    
    // Wait for DOM to be ready
    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode("qr-reader");
        qrScannerRef.current = html5QrCode;
        
        const devices = await Html5Qrcode.getCameras();
        const cameraId = devices.length > 0 ? devices[0].id : { facingMode: "environment" };
        
        await html5QrCode.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            console.log("QR Code scanned:", decodedText);
            
            // Parse QR code content - support both qastra and starcade formats for backward compatibility
            const isQastraFormat = decodedText.startsWith('qastra###transfer###');
            const isStarcadeFormat = decodedText.startsWith('starcade###transfer###');
            
            if (isQastraFormat || isStarcadeFormat) {
              const parts = decodedText.split('###');
              if (parts.length >= 4) {
                const recipientAddress = parts[2];
                const amount = parts[3];
                const memo = parts[4] || '';
                
                console.log('Parsed transfer request:', { recipientAddress, amount, memo });
                
                // Stop scanner and open send modal with pre-filled data
                stopQRScanner();
                
                // Set send form data
                setSendFrom(accounts[activeAccountIndex].publicKey);
                setSendTo(recipientAddress);
                setSendAmount(amount);
                setSendMemo(memo);
                setIsPayMode(true);
                setShowSendModal(true);
              } else {
                console.log('Invalid QR code format');
                alert('Invalid QR code format');
                stopQRScanner();
              }
            } else {
              console.log('QR code does not contain Qastra/Starcade transfer data');
              alert('Invalid payment QR code. Please scan a valid Qastra payment QR.');
              stopQRScanner();
            }
          },
          () => {
            // Ignore error messages during scanning
          }
        );
      } catch (err) {
        console.error("Failed to start QR scanner:", err);
        alert("Failed to access camera. Please allow camera permissions.");
        setShowQRScanner(false);
      }
    }, 100);
  };

  const switchCamera = async (cameraId: string) => {
    setSelectedCamera(cameraId);
    
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.stop();
        
        await qrScannerRef.current.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            console.log("QR Code scanned:", decodedText);
            
            // Parse QR code content - support both qastra and starcade formats for backward compatibility
            const isQastraFormat = decodedText.startsWith('qastra###transfer###');
            const isStarcadeFormat = decodedText.startsWith('starcade###transfer###');
            
            if (isQastraFormat || isStarcadeFormat) {
              const parts = decodedText.split('###');
              if (parts.length >= 4) {
                const recipientAddress = parts[2];
                const amount = parts[3];
                const memo = parts[4] || '';
                
                console.log('Parsed transfer request:', { recipientAddress, amount, memo });
                
                // Stop scanner and open send modal with pre-filled data
                stopQRScanner();
                
                // Set send form data
                setSendFrom(accounts[activeAccountIndex].publicKey);
                setSendTo(recipientAddress);
                setSendAmount(amount);
                setSendMemo(memo);
                setIsPayMode(true);
                setShowSendModal(true);
              } else {
                console.log('Invalid QR code format');
                alert('Invalid QR code format');
                stopQRScanner();
              }
            } else {
              console.log('QR code does not contain Qastra/Starcade transfer data');
              alert('Invalid payment QR code. Please scan a valid Qastra payment QR.');
              stopQRScanner();
            }
          },
          () => {
            // Ignore error messages during scanning
          }
        );
      } catch (err) {
        console.error("Failed to switch camera:", err);
      }
    }
  };

  const stopQRScanner = async () => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.stop();
        qrScannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      qrScannerRef.current = null;
    }
    setShowQRScanner(false);
  };

  const createNewWallet = async () => {
    const stellarWallet = new StellarWallet({ network });
    const keypair = stellarWallet.generateKeypair();
    
    const newAccount = {
      publicKey: keypair.publicKey,
      name: 'Account 1',
      balance: '0.00',
    };

    // Save to chrome storage
    const walletData = {
      accounts: [newAccount],
      activeAccountIndex: 0,
      network,
    };

    chrome.storage.local.set({ wallet: walletData }, () => {
      setAccounts([newAccount]);
      
      // Also save the secret key (in production, this should be encrypted)
      chrome.storage.local.set({
        [`key_${keypair.publicKey}`]: keypair.secretKey,
      });
    });

    // Fund account if on testnet
    if (network === NetworkType.TESTNET) {
      try {
        await stellarWallet.fundTestnetAccount(keypair.publicKey);
        alert('Account funded successfully on testnet!');
      } catch (error) {
        console.error('Failed to fund account:', error);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
      console.log('Copied to clipboard:', text);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  const createNewAccount = async () => {
    const stellarWallet = new StellarWallet({ network });
    const keypair = stellarWallet.generateKeypair();
    
    const newAccount = {
      publicKey: keypair.publicKey,
      name: `Account ${accounts.length + 1}`,
      balance: '0.00',
    };

    const updatedAccounts = [...accounts, newAccount];
    
    // Save to chrome storage
    chrome.storage.local.get(['wallet'], (result) => {
      const walletData = {
        ...(result.wallet || {}),
        accounts: updatedAccounts,
        activeAccountIndex: result.wallet?.activeAccountIndex || 0,
        network,
      };

      chrome.storage.local.set({ wallet: walletData }, () => {
        console.log('New account created, setting accounts:', updatedAccounts);
        setAccounts(updatedAccounts);
        setShowAddAccount(false);
        
        // Save secret key
        chrome.storage.local.set({
          [`key_${keypair.publicKey}`]: keypair.secretKey,
        });

        // Fund account if on testnet (don't reload balances automatically)
        if (network === NetworkType.TESTNET) {
          stellarWallet.fundTestnetAccount(keypair.publicKey)
            .then(() => {
              console.log('Account funded successfully');
            })
            .catch(console.error);
        }
      });
    });
  };

  const importAccount = async () => {
    if (!importSecret.trim()) return;
    
    setIsImporting(true);
    try {
      const stellarWallet = new StellarWallet({ network });
      const keypair = stellarWallet.importAccount(importSecret.trim());
      
      // Check if account already exists
      if (accounts.some(acc => acc.publicKey === keypair.publicKey)) {
        alert('This account already exists!');
        setIsImporting(false);
        return;
      }

      const newAccount = {
        publicKey: keypair.publicKey,
        name: `Account ${accounts.length + 1}`,
        balance: '0.00',
      };

      const updatedAccounts = [...accounts, newAccount];
      
      chrome.storage.local.get(['wallet'], (result) => {
        const walletData = {
          ...(result.wallet || {}),
          accounts: updatedAccounts,
          activeAccountIndex: result.wallet?.activeAccountIndex || 0,
          network,
        };

        chrome.storage.local.set({ wallet: walletData }, () => {
          setAccounts(updatedAccounts);
          setShowAddAccount(false);
          setImportSecret('');
          
          // Save secret key
          chrome.storage.local.set({
            [`key_${keypair.publicKey}`]: keypair.secretKey,
          });
        });
      });
    } catch (error) {
      alert('Invalid secret key!');
      console.error('Import failed:', error);
    }
    setIsImporting(false);
  };

  const startEditingName = (publicKey: string, currentName: string) => {
    setEditingAccount(publicKey);
    setEditName(currentName);
  };

  const saveAccountName = () => {
    if (!editingAccount || !editName.trim()) return;

    const updatedAccounts = accounts.map(acc => 
      acc.publicKey === editingAccount 
        ? { ...acc, name: editName.trim() }
        : acc
    );

    console.log('Saving account name, updated accounts:', updatedAccounts);
    setAccounts(updatedAccounts);

    chrome.storage.local.get(['wallet'], (result) => {
      if (result.wallet) {
        const updatedWallet = {
          ...result.wallet,
          accounts: updatedAccounts,
        };
        console.log('Saving wallet with new name:', updatedWallet);
        chrome.storage.local.set({ wallet: updatedWallet });
      }
    });

    setEditingAccount(null);
    setEditName('');
  };

  const fundActiveAccount = async () => {
    if (network !== NetworkType.TESTNET) {
      alert('Funding is only available on Testnet');
      return;
    }

    const activeAccount = accounts[activeAccountIndex];
    if (!activeAccount) {
      alert('No active account');
      return;
    }

    setLoadingBalance(true);
    try {
      const wallet = new StellarWallet({ network });
      await wallet.fundTestnetAccount(activeAccount.publicKey);
      alert('Account funded successfully with 10,000 XLM!');
      // Reload balance after funding
      setTimeout(() => loadBalances(), 2000);
    } catch (error: any) {
      console.error('Failed to fund account:', error);
      alert('Failed to fund account: ' + error.message);
    }
    setLoadingBalance(false);
  };

  const sendXLM = async () => {
    if (!sendFrom || !sendTo || !sendAmount) {
      alert('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsSending(true);
    setShowSendModal(false);
    setShowTransactionStatus(true);
    setTransactionResult({ status: 'sending' });

    try {
      // Get the secret key from storage
      const result = await chrome.storage.local.get([`key_${sendFrom}`]);
      const secretKey = result[`key_${sendFrom}`];

      if (!secretKey) {
        setTransactionResult({
          status: 'error',
          message: 'Secret key not found for this account',
        });
        setIsSending(false);
        return;
      }

      const wallet = new StellarWallet({ network });
      const txResult = await wallet.sendPayment(secretKey, {
        destination: sendTo,
        amount: sendAmount,
        memo: sendMemo || undefined,
      });

      setTransactionResult({
        status: 'success',
        hash: txResult.hash,
        message: 'Payment sent successfully!',
      });

      setSendFrom('');
      setSendTo('');
      setSendAmount('');
      setSendMemo('');
      
      // Reload balances
      setTimeout(() => loadBalances(), 2000);
    } catch (error: any) {
      console.error('Send failed:', error);
      setTransactionResult({
        status: 'error',
        message: error.message || 'Failed to send payment',
      });
    }
    setIsSending(false);
  };

  const setActiveAccount = (index: number) => {
    setActiveAccountIndex(index);
    chrome.storage.local.get(['wallet'], (result) => {
      if (result.wallet) {
        const updatedWallet = {
          ...result.wallet,
          activeAccountIndex: index,
        };
        chrome.storage.local.set({ wallet: updatedWallet });
      }
    });
    setShowAccountList(false);
  };

  const switchNetwork = async () => {
    const newNetwork = network === NetworkType.TESTNET ? NetworkType.PUBLIC : NetworkType.TESTNET;
    setNetwork(newNetwork);
    setLoadingBalance(true);
    
    // Wait for state to update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Create wallet with new network immediately
    const wallet = new StellarWallet({ network: newNetwork });
    
    const updatedAccounts = await Promise.all(
      accounts.map(async (account) => {
        try {
          const details = await wallet.getAccountDetails(account.publicKey);
          const xlmBalance = details.balances.find(
            (b: any) => b.asset_type === 'native'
          );
          return {
            publicKey: account.publicKey,
            name: account.name,
            balance: xlmBalance ? parseFloat(xlmBalance.balance).toFixed(2) : '0.00',
          };
        } catch (error: any) {
          console.log('Account not found or not funded:', account.publicKey);
          return { 
            publicKey: account.publicKey,
            name: account.name,
            balance: '0.00' 
          };
        }
      })
    );

    setAccounts(updatedAccounts);
    
    chrome.storage.local.get(['wallet'], (result) => {
      if (result.wallet) {
        const updatedWallet = {
          ...result.wallet,
          accounts: updatedAccounts,
        };
        chrome.storage.local.set({ wallet: updatedWallet, network: newNetwork });
      } else {
        chrome.storage.local.set({ network: newNetwork });
      }
    });
    
    setLoadingBalance(false);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="container">
        <div className="welcome">
          <img src="icons/icon.png" alt="Qastra" className="welcome-icon" />
          <h1>Welcome to Qastra</h1>
          <p>Your secure Stellar wallet</p>
          <button onClick={createNewWallet} className="btn-primary">
            Create New Wallet
          </button>
          <div className="network-selector">
            <label>
              <input
                type="radio"
                checked={network === NetworkType.TESTNET}
                onChange={() => setNetwork(NetworkType.TESTNET)}
              />
              Testnet
            </label>
            <label>
              <input
                type="radio"
                checked={network === NetworkType.PUBLIC}
                onChange={() => setNetwork(NetworkType.PUBLIC)}
              />
              Mainnet
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-title">
          <img src="icons/icon.png" alt="Qastra" className="header-icon" />
          <h1>Qastra</h1>
        </div>
        <div className="header-right">
          <button 
            className="btn-icon" 
            onClick={loadBalances} 
            disabled={loadingBalance}
            title="Refresh Balance"
          >
            {loadingBalance ? '⟳' : '↻'}
          </button>
          {network === NetworkType.TESTNET && (
            <button 
              className="btn-icon" 
              onClick={fundActiveAccount} 
              disabled={loadingBalance}
              title="Fund Testnet Account"
            >
              ☄
            </button>
          )}
          <button 
            className="network-badge" 
            onClick={switchNetwork}
            title="Switch Network"
          >
            {network === NetworkType.TESTNET ? 'Testnet' : 'Mainnet'}
          </button>
          <button
            className="btn-icon"
            onClick={() => setShowAccountList(true)}
            title="Accounts"
          >
            ☰
          </button>
        </div>
      </div>
      
      <div className="accounts">
        {accounts[activeAccountIndex] && (
          <div className="account-card">
            <div className="account-header">
              <div className="account-name-row">
                <div className="account-name">{accounts[activeAccountIndex].name}</div>
                <button 
                  className="btn-icon-small" 
                  onClick={() => setShowAccountList(true)}
                  title="Switch Account"
                >
                  ☰
                </button>
              </div>
            </div>
            <div className="account-address-row">
              <div className="account-address">
                {accounts[activeAccountIndex].publicKey.substring(0, 8)}...
                {accounts[activeAccountIndex].publicKey.substring(accounts[activeAccountIndex].publicKey.length - 8)}
              </div>
              <button 
                className="btn-copy" 
                onClick={() => copyToClipboard(accounts[activeAccountIndex].publicKey)}
                title="Copy Address"
              >
                📋
              </button>
            </div>
            <div className="account-balance">
              {loadingBalance ? (
                <span className="loading-text">Loading...</span>
              ) : (
                <>{accounts[activeAccountIndex].balance || '0.00'} XLM</>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="actions">
        <button className="btn-secondary" onClick={() => {
          if (accounts.length > 0) {
            setSendFrom(accounts[activeAccountIndex].publicKey);
            setIsPayMode(false);
            setShowSendModal(true);
          }
        }}>Send</button>
        <button className="btn-secondary" onClick={startQRScanner}>Pay</button>
      </div>

      <button className="btn-add-account" onClick={() => setShowAddAccount(true)}>
        + Add Account
      </button>

      {showAccountList && (
        <div className="modal-overlay" onClick={() => setShowAccountList(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Select Account</h2>
            
            <div className="account-list">
              {accounts.map((account, index) => (
                <div 
                  key={account.publicKey} 
                  className={`account-list-item ${index === activeAccountIndex ? 'active' : ''}`}
                  onClick={() => setActiveAccount(index)}
                >
                  <div className="account-list-header">
                    <div className="account-list-name">
                      {account.name}
                      {index === activeAccountIndex && <span className="active-badge">✓</span>}
                    </div>
                    <button 
                      className="btn-edit" 
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingName(account.publicKey, account.name);
                        setShowAccountList(false);
                      }}
                      title="Edit Name"
                    >
                      ✎
                    </button>
                  </div>
                  <div className="account-list-address">
                    {account.publicKey.substring(0, 8)}...{account.publicKey.substring(account.publicKey.length - 8)}
                  </div>
                  <div className="account-list-balance">
                    {account.balance || '0.00'} XLM
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-cancel" onClick={() => setShowAccountList(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {editingAccount && (
        <div className="modal-overlay" onClick={() => setEditingAccount(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Account Name</h2>
            
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="input-secret"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && saveAccountName()}
              placeholder="Account name"
            />

            <button className="btn-modal" onClick={saveAccountName}>
              Save
            </button>

            <button className="btn-cancel" onClick={() => setEditingAccount(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showAddAccount && (
        <div className="modal-overlay" onClick={() => setShowAddAccount(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Account</h2>
            
            <button className="btn-modal" onClick={createNewAccount}>
              Create New Account
            </button>

            <div className="divider">OR</div>

            <input
              type="text"
              placeholder="Enter Secret Key (S...)"
              value={importSecret}
              onChange={(e) => setImportSecret(e.target.value)}
              className="input-secret"
            />

            <button 
              className="btn-modal" 
              onClick={importAccount}
              disabled={!importSecret.trim() || isImporting}
            >
              {isImporting ? 'Importing...' : 'Import Account'}
            </button>

            <button className="btn-cancel" onClick={() => setShowAddAccount(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showSendModal && (
        <div className="modal-overlay" onClick={() => {
          setShowSendModal(false);
          setIsPayMode(false);
        }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{isPayMode ? 'Pay XLM' : 'Send XLM'}</h2>
            
            <label className="input-label">From Account</label>
            <select 
              className="input-select"
              value={sendFrom}
              onChange={(e) => setSendFrom(e.target.value)}
            >
              {accounts.map((account) => (
                <option key={account.publicKey} value={account.publicKey}>
                  {account.name} ({account.balance} XLM)
                </option>
              ))}
            </select>

            <label className="input-label">To Address</label>
            <input
              type="text"
              placeholder="G..."
              value={sendTo}
              onChange={(e) => setSendTo(e.target.value)}
              className="input-secret"
            />

            <label className="input-label">Amount (XLM)</label>
            <input
              type="text"
              placeholder="0.00"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              className="input-secret"
            />

            <label className="input-label">Memo (Optional)</label>
            <input
              type="text"
              placeholder="Transaction note"
              value={sendMemo}
              onChange={(e) => setSendMemo(e.target.value)}
              className="input-secret"
            />

            <button 
              className="btn-modal" 
              onClick={sendXLM}
              disabled={!sendFrom || !sendTo || !sendAmount || isSending}
            >
              {isSending ? 'Sending...' : 'Send Payment'}
            </button>

            <button className="btn-cancel" onClick={() => {
              setShowSendModal(false);
              setIsPayMode(false);
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showTransactionStatus && transactionResult && (
        <div className="modal-overlay">
          <div className="modal transaction-modal">
            {transactionResult.status === 'sending' && (
              <>
                <div className="tx-icon tx-loading"></div>
                <h2>Sending Payment</h2>
                <p className="tx-message">Please wait while your transaction is being processed...</p>
              </>
            )}

            {transactionResult.status === 'success' && (
              <>
                <div className="tx-icon tx-success">✓</div>
                <h2>Payment Successful!</h2>
                <p className="tx-message">{transactionResult.message}</p>
                
                {transactionResult.hash && (
                  <div className="tx-hash-container">
                    <label className="input-label">Transaction Hash</label>
                    <div className="tx-hash-row">
                      <div className="tx-hash">
                        {transactionResult.hash.substring(0, 12)}...{transactionResult.hash.substring(transactionResult.hash.length - 12)}
                      </div>
                      <button 
                        className="btn-copy" 
                        onClick={() => copyToClipboard(transactionResult.hash!)}
                        title="Copy Hash"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                )}

                {transactionResult.hash && (
                  <a 
                    href={`https://stellar.expert/explorer/${network === NetworkType.TESTNET ? 'testnet' : 'public'}/tx/${transactionResult.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-modal"
                    style={{ marginTop: '20px', marginBottom: '15px' }}
                  >
                    View on Stellar Expert
                  </a>
                )}

                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setShowTransactionStatus(false);
                    setTransactionResult(null);
                  }}
                  style={{ marginTop: '15px', width: '100%' }}
                >
                  Close
                </button>
              </>
            )}

            {transactionResult.status === 'error' && (
              <>
                <div className="tx-icon tx-error">✗</div>
                <h2>Transaction Failed</h2>
                <p className="tx-message error">{transactionResult.message}</p>
                
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setShowTransactionStatus(false);
                    setTransactionResult(null);
                    setShowSendModal(true);
                  }}
                  style={{ marginTop: '20px', width: '100%' }}
                >
                  Try Again
                </button>
                
                <button 
                  className="btn-cancel" 
                  onClick={() => {
                    setShowTransactionStatus(false);
                    setTransactionResult(null);
                  }}
                  style={{ marginTop: '10px' }}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showQRScanner && (
        <div className="modal-overlay" onClick={stopQRScanner}>
          <div className="modal qr-scanner-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Scan QR Code</h2>
            
            {cameras.length > 1 && (
              <div className="camera-selector">
                <label className="input-label">Select Camera</label>
                <select 
                  className="input-select"
                  value={selectedCamera}
                  onChange={(e) => switchCamera(e.target.value)}
                >
                  {cameras.map((camera) => (
                    <option key={camera.id} value={camera.id}>
                      {camera.label || `Camera ${camera.id}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div id="qr-reader" style={{ width: '100%' }}></div>
            <button className="btn-cancel" onClick={stopQRScanner} style={{ marginTop: '15px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
