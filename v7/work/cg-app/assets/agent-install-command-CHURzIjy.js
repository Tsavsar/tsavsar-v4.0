var a=Object.defineProperty;var s=(t,n)=>a(t,"name",{value:n,configurable:!0});const l="/work/cg-app/assets/docker-BdqjcM6t.svg",p="/work/cg-app/assets/linux-DwJAcUeD.svg",g="costgraph-agent";function o(t){return t?{backend:t,remoteWrite:`${t}/api/v1/write`}:null}s(o,"agentEndpoints");const c={linux:s((t,n)=>{const e=o(n),r=e?`COSTGRAPH_API_KEY="${t}" \\
  COSTGRAPH_BACKEND_URL="${e.backend}" \\
  COSTGRAPH_REMOTE_WRITE_URL="${e.remoteWrite}"`:`COSTGRAPH_API_KEY="${t}"`;return`# One-line install (Debian, Ubuntu, RHEL, Amazon Linux, Alpine)
curl -sSL https://setup.costgraph.ai/install.sh | ${r} sh

# Or download, inspect, then run:
curl -sSL https://setup.costgraph.ai/install.sh -o install.sh
chmod +x install.sh
${r} ./install.sh`},"linux"),docker:s((t,n)=>{const e=o(n),r=e?`
  -e COSTGRAPH_BACKEND_URL="${e.backend}" \\
  -e COSTGRAPH_REMOTE_WRITE_URL="${e.remoteWrite}" \\`:"";return`# Log in with an API key that has the deployment:register scope
docker login registry.costgraph.ai -u x

docker run -d \\
  --name costgraph-agent \\
  --restart=unless-stopped \\
  --pid=host \\
  --network=host \\
  -v /proc:/host/proc:ro \\
  -v /sys:/host/sys:ro \\
  -e COSTGRAPH_API_KEY="${t}" \\${r}
  registry.costgraph.ai/costgraph-agent:latest`},"docker"),macos:s((t,n)=>{const e=o(n);return`# 1. Install the formula
brew install baselinehq/tap/costgraph-agent

# 2. Set these in $(brew --prefix)/etc/costgraph_agent/config.yaml:
${e?`#    api_key: "${t}"
#    backend_url: "${e.backend}"
#    remote_write_url: "${e.remoteWrite}"`:`#    api_key: "${t}"`}
sudo chown root $(brew --prefix)/etc/costgraph_agent/config.yaml
sudo chmod 600 $(brew --prefix)/etc/costgraph_agent/config.yaml

# 3. Start the service
sudo brew services start costgraph-agent`},"macos")};function h(t,n,e){return c[t](n,e)}s(h,"buildAgentInstallCommand");export{g as A,h as b,l as d,p as l};
