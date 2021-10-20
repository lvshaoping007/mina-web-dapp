let account

const initializeMina = async () => {
  const onboardButton = document.getElementById('connectButton')
  const getAccountsButton = document.getElementById('getAccounts')
  const getAccountsResults = document.getElementById('getAccountsResult')

  onboardButton.onclick = () => {
    if (!window.mina) {
      alert("请先安装mina-extension-wallet")
    } else {
      onboardButton.innerText = 'Onboarding in progress'
      window.mina.requestAccounts().then((approveAccount) => {
        if (Array.isArray(approveAccount) && approveAccount.length > 0) {
          account = approveAccount
          document.getElementById('accounts').innerHTML = approveAccount;
          onboardButton.innerText = 'Connected'
          onboardButton.disabled = true
        } else {
          onboardButton.innerText = approveAccount.error
        }
      })
        ;
    }
  }
  /**
   * get account
   */
  getAccountsButton.onclick = async () => {
    if (window.mina) {
      account = await window.mina.getAccounts();
      if (Array.isArray(account) && account.length > 0) {
        getAccountsResults.innerHTML = account || 'Not able to get accounts'
      }
    }
  }


  const sendButton = document.getElementById('sendButton')
  const sendAmountInput = document.getElementById('sendAmountInput')
  const receiveAddressInput = document.getElementById('receiveAddressInput')
  const sendResultDisplay = document.getElementById('sendResultDisplay')

  /**
   * send transfer // 转账
   */
  sendButton.onclick = async () => {
    let from = account && account.length > 0 ? account[0] : ""
    let signResult = await window.mina.signTransaction({
      amount: sendAmountInput.value,
      from: from,
      to: receiveAddressInput.value,
    })
    sendResultDisplay.innerHTML = signResult.error || signResult.hash
  }


  /**
   * add escrow 质押
   */
  const stakingButton = document.getElementById('stakingButton')
  const vaildatorAddressInput = document.getElementById('vaildatorAddressInput')
  const stakingResultDisplay = document.getElementById('stakingResultDisplay')

  stakingButton.onclick = async () => {//质押不用输入金额
    let from = account && account.length > 0 ? account[0] : ""
    let signResult = await window.mina.stakingTransaction({
      from: from,
      to: vaildatorAddressInput.value,
    })
    stakingResultDisplay.innerHTML = signResult.error || signResult.hash
  }

  /**
   * sign message
   */
  const signMessageButton = document.getElementById('signMessageButton')
  const signMessageContent = document.getElementById('signMessageContent')
  const signMessageResult = document.getElementById('signMessageResult')
  const signVerifyButton = document.getElementById('signVerifyButton')
  const verifyResult = document.getElementById('verifyResult')


  let signResult

  signMessageButton.onclick = async () => {
    let from = account && account.length > 0 ? account[0] : ""
    signResult = await window.mina.signMessage({
      from: from,
      message: signMessageContent.value,
    })
    signMessageResult.innerHTML = signResult.error || signResult.signature
  }

  /**
   * Verify Message
   */
  signVerifyButton.onclick = async () => {
    let messageVerifyResult = await window.mina.verifyMessage({
      message: signResult.signature,
    })
    verifyResult.innerHTML = messageVerifyResult?.error?.message || messageVerifyResult
  }



  /**
   * get account from extension
   */
  async function getAccount() {
    if (window.mina) {
      account = await window.mina.getAccounts()
      if (Array.isArray(account) && account.length > 0) {
        onboardButton.innerText = 'Connected'
        onboardButton.disabled = true
        document.getElementById('accounts').innerHTML = account[0] || "";
      }
    }
  }
  setTimeout(() => {
    getAccount()
    if (window.mina) {
      window.mina.onAccountChange('accountsChanged', handleNewAccounts);
    }
  }, 200);

  function handleNewAccounts(newAccounts) {
    if (Array.isArray(newAccounts)) {
      document.getElementById('accounts').innerHTML = newAccounts;
      if (newAccounts.length === 0) {
        onboardButton.innerText = 'Connect'
        onboardButton.disabled = false
      }
    }
  }
}
window.addEventListener('DOMContentLoaded', initializeMina)