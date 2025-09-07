class a{stats;constructor(){this.stats={totalImages:0,backgroundImages:0,imgElements:0},this.initialize()}async initialize(){await this.loadStats(),this.render(),this.setupEventListeners(),setInterval(()=>{this.loadStats().then(()=>this.render())},1e3)}async loadStats(){try{const t=await chrome.runtime.sendMessage({type:"GET_STATS"});if(t){this.stats=t;return}}catch{console.log("Could not get stats from background script")}try{const[t]=await chrome.tabs.query({active:!0,currentWindow:!0});if(t?.id){const s=await chrome.scripting.executeScript({target:{tabId:t.id},func:()=>{const e=window;return e.cleanWebExtension?e.cleanWebExtension.getStats():null}});s?.[0]?.result&&(this.stats=s[0].result)}}catch(t){console.log("Could not get stats from content script:",t)}}render(){const t=document.getElementById("content");t&&(t.innerHTML=`
      <div class="stats-container">
        <div class="stats-title">Detection Stats</div>
        <div class="stat-item">
          <span>Total Images:</span>
          <span class="stat-value">${this.stats.totalImages}</span>
        </div>
        <div class="stat-item">
          <span>IMG Elements:</span>
          <span class="stat-value">${this.stats.imgElements}</span>
        </div>
        <div class="stat-item">
          <span>Background Images:</span>
          <span class="stat-value">${this.stats.backgroundImages}</span>
        </div>
      </div>
      <button id="refresh-btn" class="refresh-btn">Refresh</button>
    `)}setupEventListeners(){document.addEventListener("click",t=>{const s=t.target;s&&s.id==="refresh-btn"&&this.loadStats().then(()=>this.render())})}}document.addEventListener("DOMContentLoaded",()=>{new a});
