let account

const initializeMina = async () => {
  const onboardButton = document.getElementById('connectButton')
  const getAccountsButton = document.getElementById('getAccounts')
  const getAccountsResults = document.getElementById('getAccountsResult')

  onboardButton.onclick = () => {
    if (!window.mina) {
      alert("请先安装auro-extension-wallet")
    } else {
      onboardButton.innerText = 'Onboarding in progress'
      window.mina.requestAccounts().then((data) => {
        let approveAccount = data.result
        console.log('requestAccounts=', approveAccount)
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
      let approveAccount = await window.mina.requestAccounts();
      account = approveAccount.result
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
   * transfer 
   */
  sendButton.onclick = async () => {
    let from = account && account.length > 0 ? account[0] : ""
    let signResult = await window.mina.signTransfer({
      amount: sendAmountInput.value,
      from: from,
      to: receiveAddressInput.value,
    })
    console.log('signResult--0', signResult)
    sendResultDisplay.innerHTML = signResult.error || signResult.result.hash
  }


  /**
   * staking
   */
  const stakingButton = document.getElementById('stakingButton')
  const vaildatorAddressInput = document.getElementById('vaildatorAddressInput')
  const stakingResultDisplay = document.getElementById('stakingResultDisplay')

  stakingButton.onclick = async () => {//质押不用输入金额
    let from = account && account.length > 0 ? account[0] : ""
    let signResult = await window.mina.signStaking({
      from: from,
      to: vaildatorAddressInput.value,
    })
    console.log('signVerifyButton--0', signResult)
    stakingResultDisplay.innerHTML = signResult.error || signResult.result.hash
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
    console.log('signMessageButton--0', signResult)
    signMessageResult.innerHTML = signResult.error || signResult.result.signature
  }

  /**
   * Verify Message
   */
  signVerifyButton.onclick = async () => {
    let messageVerifyResult = await window.mina.verifyMessage({
      message: signResult?.result?.signature,
    })
    console.log('signVerifyButton--0', messageVerifyResult)
    verifyResult.innerHTML = messageVerifyResult?.error || messageVerifyResult.result
  }


  setTimeout(() => {
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