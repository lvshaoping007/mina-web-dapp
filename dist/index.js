let account;const initializeMina=async()=>{const n=document.getElementById("connectButton"),e=document.getElementById("getAccounts"),t=document.getElementById("getAccountsResult");n.onclick=()=>{window.mina?(n.innerText="Onboarding in progress",window.mina.requestAccounts().then((e=>{Array.isArray(e)&&e.length>0?(account=e,document.getElementById("accounts").innerHTML=e,n.innerText="Connected",n.disabled=!0):n.innerText=e.error}))):alert("请先安装mina-extension-wallet")},e.onclick=async()=>{window.mina&&(account=await window.mina.getAccounts(),Array.isArray(account)&&account.length>0&&(t.innerHTML=account||"Not able to get accounts"))};const c=document.getElementById("sendButton"),o=document.getElementById("sendAmountInput"),a=document.getElementById("receiveAddressInput"),i=document.getElementById("sendResultDisplay");c.onclick=async()=>{let n=account&&account.length>0?account[0]:"",e=await window.mina.signTransaction({amount:o.value,from:n,to:a.value});i.innerHTML=e.error||e.hash};const s=document.getElementById("stakingButton"),u=document.getElementById("vaildatorAddressInput"),d=document.getElementById("stakingResultDisplay");s.onclick=async()=>{let n=account&&account.length>0?account[0]:"",e=await window.mina.stakingTransaction({from:n,to:u.value});d.innerHTML=e.error||e.hash};const r=document.getElementById("signMessageButton"),l=document.getElementById("signMessageContent"),m=document.getElementById("signMessageResult"),g=document.getElementById("signVerifyButton"),y=document.getElementById("verifyResult");let w;function B(e){Array.isArray(e)&&(document.getElementById("accounts").innerHTML=e,0===e.length&&(n.innerText="Connect",n.disabled=!1))}r.onclick=async()=>{let n=account&&account.length>0?account[0]:"";w=await window.mina.signMessage({from:n,message:l.value}),m.innerHTML=w.error||w.signature},g.onclick=async()=>{let n=await window.mina.verifyMessage({message:w.signature});y.innerHTML=n?.error?.message||n},setTimeout((()=>{!async function(){window.mina&&(account=await window.mina.getAccounts(),Array.isArray(account)&&account.length>0&&(n.innerText="Connected",n.disabled=!0,document.getElementById("accounts").innerHTML=account[0]||""))}(),window.mina&&window.mina.onAccountChange("accountsChanged",B)}),200)};window.addEventListener("DOMContentLoaded",initializeMina);