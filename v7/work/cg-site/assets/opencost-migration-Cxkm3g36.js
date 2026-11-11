import{j as e,b4 as c}from"./index-DO1J06vb.js";import{M as i}from"./MetaTags-7Rqjl1C2.js";import{P as l}from"./PostLayout-CL0Bqh8X.js";import{F as h,a as o}from"./Faq-CRPikb26.js";import{H as d}from"./Highlight-CqyX5HkE.js";import{u as r}from"./_slug_-B9FXkoW_.js";import"./use-no-widows-CSG_karp.js";import"./post-card-tLmU6kcm.js";const n=c("opencost-migration");function a(t){const s={a:"a",code:"code",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:n.title,description:n.summary,type:"article",url:n.canonicalUrl,author:n.authors[0],date:n.date,category:n.category,image:n.heroImage}),`
`,e.jsxs(l,{meta:n,children:[e.jsx(s.p,{children:"OpenCost answers a handful of questions well, like what a namespace, pod, or workload in a cluster costs. After that there is not much else in terms of visibility beyond your cluster, which means your database, model spend, and even the CI that runs your builds are left unaccounted for."}),e.jsx(s.p,{children:"One of the earliest goals for CostGraph was to provide workload and tenant level visibility into compute and Kubernetes clusters. Which is why we are proud to announce that, starting today, you can use CostGraph as a drop-in replacement for OpenCost."}),e.jsx(s.p,{children:"In this blog, I will walk you through migrating an existing OpenCost instance to CostGraph."}),e.jsx(s.h2,{children:"Why move"}),e.jsx(s.p,{children:'"Why should I move?" I hear you say. Well, here are a few reasons.'}),e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Same API."})," Existing scrapers, budget checks, and scripts point at a new base URL with a key. The routes, parameters, and response fields are the ones OpenCost defines."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Bills outside the cluster."})," CostGraph connects to the clouds, AI APIs, databases, and tools you pay for, so the cluster's cost sits next to what runs around it."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Something to do about it."})," Rightsizing recommendations tell you what to change, the request or instance type to move to, and how much the change saves."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Ownership without labels."})," Virtual tags assign spend to teams and customers from rules, and nothing is written back to the cluster."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"No Prometheus to run."})," The operator ships its own scrapers."]}),`
`]}),e.jsx(s.h2,{children:"Prerequisites"}),e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["A ",e.jsx(s.a,{href:"https://app.costgraph.ai/create-account",children:"CostGraph account"})," and an API key with the ",e.jsx(s.code,{children:"operator:read"})," scope from ",e.jsx(s.strong,{children:"Settings > Personal API Keys"}),"."]}),`
`,e.jsxs(s.li,{children:["The ",e.jsx(s.a,{href:"https://docs.costgraph.ai",children:"CostGraph CLI"})," installed and signed in: ",e.jsx(s.code,{children:"curl -fsSL costgraph.ai/cli | sh"})," then ",e.jsx(s.code,{children:"costgraph auth login"}),"."]}),`
`,e.jsxs(s.li,{children:["A Kubernetes cluster running OpenCost. We create one below with ",e.jsx(s.a,{href:"https://eksctl.io",children:"eksctl"}),"; skip that section if you already have one."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"helm"}),", ",e.jsx(s.code,{children:"kubectl"}),", ",e.jsx(s.code,{children:"curl"}),", and ",e.jsx(s.code,{children:"jq"}),"."]}),`
`]}),e.jsx(s.h2,{children:"Create the cluster and install OpenCost"}),e.jsx(s.p,{children:"We'll begin by creating a two-node cluster with eksctl from a config file."}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-shell",children:`cat > cg-opencost.yaml <<'CONFIG'
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: cg-opencost-migration-demo
  region: us-east-1
  version: "1.31"
managedNodeGroups:
  - name: workers
    instanceType: t3.medium
    desiredCapacity: 2
    minSize: 2
    maxSize: 2
    volumeSize: 20
CONFIG
eksctl create cluster -f cg-opencost.yaml
kubectl get nodes
`})}),e.jsxs(s.p,{children:[e.jsx(d,{children:"Already running OpenCost? This entire section is optional."}),` Skip ahead to
`,e.jsx(s.a,{href:"#install-the-costgraph-operator",children:"Install the CostGraph operator"}),"."]}),e.jsx(s.p,{children:"OpenCost reads from Prometheus, so install Prometheus first with the scrape config OpenCost's chart expects, then OpenCost itself. A fresh EKS cluster has no storage driver, so Prometheus runs without a persistent volume here; on a cluster that has one, drop that flag."}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-shell",children:`helm install prometheus prometheus-community/prometheus \\
  --namespace prometheus-system --create-namespace \\
  --set prometheus-pushgateway.enabled=false \\
  --set alertmanager.enabled=false \\
  --set server.persistentVolume.enabled=false \\
  -f https://raw.githubusercontent.com/opencost/opencost/develop/kubernetes/prometheus/extraScrapeConfigs.yaml

helm install opencost opencost/opencost --namespace opencost --create-namespace
kubectl get pods -n opencost
`})}),e.jsxs(s.p,{children:["To give OpenCost something to measure, create a ",e.jsx(s.code,{children:"shop"})," namespace with two deployments that declare CPU and memory requests."]}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-shell",children:`kubectl create namespace shop
kubectl -n shop apply -f - <<'MANIFEST'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: storefront
spec:
  replicas: 3
  selector:
    matchLabels: { app: storefront }
  template:
    metadata:
      labels: { app: storefront }
    spec:
      containers:
        - name: web
          image: nginx:1.27-alpine
          resources:
            requests: { cpu: 250m, memory: 256Mi }
            limits: { cpu: 500m, memory: 512Mi }
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: checkout
spec:
  replicas: 2
  selector:
    matchLabels: { app: checkout }
  template:
    metadata:
      labels: { app: checkout }
    spec:
      containers:
        - name: api
          image: nginx:1.27-alpine
          resources:
            requests: { cpu: 500m, memory: 512Mi }
            limits: { cpu: 1, memory: 1Gi }
MANIFEST
`})}),e.jsx(s.p,{children:"Query OpenCost for cost by namespace over the last hour, through a port-forward to the OpenCost service."}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-shell",children:`kubectl -n opencost port-forward svc/opencost 9003:9003 &
curl -s "http://localhost:9003/allocation/compute?window=1h&aggregate=namespace" \\
  | jq '.data[0] | to_entries[] | {namespace: .key, totalCost: .value.totalCost}'
`})}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-text",children:`{
  "namespace": "costgraph",
  "totalCost": 0.00576
}
{
  "namespace": "kube-system",
  "totalCost": 0.0053
}
{
  "namespace": "opencost",
  "totalCost": 0.00034
}
{
  "namespace": "prometheus-system",
  "totalCost": 0.00043
}
{
  "namespace": "shop",
  "totalCost": 0.01962
}
`})}),e.jsx(s.h2,{children:"Install the CostGraph operator"}),e.jsx(s.p,{children:"Using Helm, install the CostGraph operator chart. Export the API key you created in the prerequisites first, and give Helm the cluster's name so everything the operator reports arrives under the right cluster."}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-shell",children:`helm repo add costgraph http://charts.costgraph.ai/
helm repo update
export COSTGRAPH_API_KEY="bl_your_key"
helm install costgraph-operator costgraph/costgraph-operator \\
  --namespace costgraph --create-namespace \\
  --set global.clusterName=cg-opencost-migration-demo \\
  --set global.apiKey=$COSTGRAPH_API_KEY \\
  --set flowtrace.enabled=false
kubectl get pods -n costgraph
`})}),e.jsxs(s.p,{children:[e.jsx(s.code,{children:"flowtrace"})," is the operator's network tracer. It needs a BPF-enabled kernel and a host-mounted cgroup v2 filesystem, which the default EKS node image doesn't give it, so we leave it off. Cost allocation doesn't depend on it."]}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-text",children:`NAME                                                     READY   STATUS    RESTARTS      AGE
costgraph-operator-cadvisor-2h4rg                        1/1     Running   0             41h
costgraph-operator-cadvisor-n7cdl                        1/1     Running   0             41h
costgraph-operator-kube-state-metrics-55b8676946-dchqn   1/1     Running   0             41h
costgraph-operator-kubernetes-68554975d6-9lb4h           1/1     Running   0             41h
costgraph-operator-prometheus-7679c5448b-jwnxf           1/1     Running   2 (40h ago)   41h
costgraph-operator-prometheus-node-exporter-dbmcs        1/1     Running   0             41h
costgraph-operator-prometheus-node-exporter-z2x9r        1/1     Running   0             41h
`})}),e.jsxs(s.p,{children:["After the pods are running, the cluster appears under ",e.jsx(s.strong,{children:"Kubernetes Clusters"})," in CostGraph within a few minutes."]}),e.jsx(s.p,{children:e.jsx(s.img,{src:"/posts/opencost-migration/cluster-page.png",alt:"The demo cluster in CostGraph: AWS and EKS badges, two nodes, 23 pods across five namespaces, and the first cents of cost"})}),e.jsx(s.h2,{children:"Point your clients at CostGraph"}),e.jsx(s.p,{children:"For every client that depends on OpenCost, you need to change the base URL and the header that holds the API key."}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-text",children:`https://api.costgraph.ai/api/v1/tenant/opencost
X-API-Key: bl_your_key
`})}),e.jsx(s.p,{children:"Earlier we ran a query for cost by namespace through the OpenCost service. The same query against CostGraph differs only in the host and the header."}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-shell",children:`curl -s "https://api.costgraph.ai/api/v1/tenant/opencost/allocation?window=1h&aggregate=cluster,namespace" \\
  -H "X-API-Key: $COSTGRAPH_API_KEY" \\
  | jq '.data[0] | to_entries[] | select(.key | startswith("cg-opencost-migration-demo/")) | {namespace: .key, totalCost: .value.totalCost}'
`})}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-text",children:`{"namespace": "cg-opencost-migration-demo/shop", "totalCost": 0.00543}
{"namespace": "cg-opencost-migration-demo/costgraph", "totalCost": 0.00159}
{"namespace": "cg-opencost-migration-demo/kube-system", "totalCost": 0.00147}
{"namespace": "cg-opencost-migration-demo/prometheus-system", "totalCost": 0.00011}
{"namespace": "cg-opencost-migration-demo/opencost", "totalCost": 9e-05}
`})}),e.jsx(s.p,{children:"We aggregate by cluster and namespace here because a CostGraph tenant holds every cluster you connect, where an OpenCost install holds one."}),e.jsx(s.p,{children:"A really cool use case for this is a CI budget check, which fails the job when a namespace spends more than its budget over seven days."}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-shell",children:`#!/usr/bin/env sh
set -eu
NAMESPACE="$1"
BUDGET_USD="$2"

spent=$(curl -sf "https://api.costgraph.ai/api/v1/tenant/opencost/allocation?window=7d&aggregate=cluster,namespace" \\
  -H "X-API-Key: $COSTGRAPH_API_KEY" \\
  | jq -r --arg ns "cg-opencost-migration-demo/$NAMESPACE" '.data[0][$ns].totalCost // 0')

echo "$NAMESPACE spent $spent USD in the last 7 days (budget $BUDGET_USD)"
awk -v s="$spent" -v b="$BUDGET_USD" 'BEGIN { exit (s > b) }'
`})}),e.jsx(s.h2,{children:"The same questions, from the CLI"}),e.jsx(s.p,{children:"Cost by provider across everything the tenant pays for. The cluster's nodes land under AWS once the day's bill arrives; the rest is what OpenCost never saw."}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-shell",children:`costgraph cost get --group-by provider
`})}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-text",children:`Total 90,456.74 (previous 285,602.25, -68.3%)
  Net:                89,680.29 (credits -776.45)
  Daily average:      5,373.67
  Group by:           provider
Previous period has no comparable data; change values are not meaningful.

 NAME                  CURRENT    PREVIOUS   CHANGE  SHARE
 ──────────────────────────────────────────────────────────
 ▎ datadog           87,528.64  168,152.09   -47.9%  96.8%
 ──────────────────────────────────────────────────────────
 ▎ envoy_ai_gateway     590.64        0.00      new   0.7%
 ──────────────────────────────────────────────────────────
 ▎ agentgateway         590.18        0.00      new   0.7%
 ──────────────────────────────────────────────────────────
 ▎ vllm                 566.97        0.00      new   0.6%
 ──────────────────────────────────────────────────────────
 ▎ apisix               295.89        0.00      new   0.3%
 ──────────────────────────────────────────────────────────
 ▎ openrouter            48.58        0.00      new   0.1%
 ──────────────────────────────────────────────────────────
`})}),e.jsx(s.p,{children:"Which workloads are oversized, and what to change."}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-shell",children:`costgraph recommendations summary
`})}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-text",children:` costgraph   ·  recommendations
 # compute right-sizing

 MONTHLY SAVINGS   ANNUAL SAVINGS    ACTIONABLE        COVERAGE          RESOURCES
 $310.85           $3,730.23         13                24%               417

 ↓ DOWNSIZE 8  ·  ✕ TERMINATE 0  ·  ↑ UPSIZE 5
 = RIGHT-SIZED 71  ·  ○ NO SIGNAL 17  ·  ◌ PENDING 316

    NAME                                              CURRENT            RECOMMENDED   SAVINGS/MO
 ─────────────────────────────────────────────────────────────────────────────────────────────────
 ↓  botanix-fed-node-us-east1-mainnet                 e2-custom-4-22272  e2-highcpu-2      $79.50
 ↓  ip-10-1-5-50.us-east-2.compute.internal           t3a.xlarge         m5a.large         $47.01
 ↓  gke-botanix-main-clu-botanix-main-clu-2cc58415-…  e2-custom-4-20480  e2-highmem-2      $45.70
 ↓  gke-botanix-main-clu-botanix-main-clu-2cc58415-…  e2-custom-4-20480  e2-highmem-2      $45.70
`})}),e.jsxs(s.p,{children:["Every command takes ",e.jsx(s.code,{children:"-o json"})," for scripts and agents, and opens an interactive browser when you run it at a terminal with no flags."]}),e.jsx(s.p,{children:e.jsx(s.img,{src:"/posts/opencost-migration/cli-recommendations.png",alt:"The recommendations summary in the terminal: monthly and annual savings, the action counts, and the top savers"})}),e.jsx(s.h2,{children:"Assign the spend"}),e.jsx(s.p,{children:"OpenCost splits cost by namespace. CostGraph assigns spend to whoever should pay, from rules, and the rules can reach the bill the cluster's nodes appear on."}),e.jsxs(s.p,{children:["A tag rule can tag every AWS charge carrying the cluster's ",e.jsx(s.code,{children:"eks:cluster-name"})," tag as ",e.jsx(s.code,{children:"infra=demo"}),", so the cost of running this demo shows up as one line."]}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-shell",children:`costgraph tags create --key infra --value demo \\
  --field 'tags.eks:cluster-name' --op equals --match cg-opencost-migration-demo \\
  --description "EKS nodes of the demo cluster" --dry-run
`})}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-text",children:`costgraph   ·  new tag rule
# infra
  Key:                infra
  Scope:              billing
  Type:               literal
  Field:              tags.eks:cluster-name
  Operator:           equals
  Match:              cg-opencost-migration-demo
  Predicate:          tags.eks:cluster-name equals "cg-opencost-migration-demo"
  Value:              demo
  Description:        EKS nodes of the demo cluster

costgraph   ·  preview
# infra
  Matched rows:       0
this rule matches no cost rows
dry run: rule not created
`})}),e.jsxs(s.p,{children:["Drop ",e.jsx(s.code,{children:"--dry-run"})," to save it. From then on the ",e.jsx(s.code,{children:"infra"})," key groups the cost overview and the recommendations, and, if you bill customers, the billing export. The rule matches once the day's rows reach the bill, and AWS includes that tag in the export only if it's activated as a cost allocation tag."]}),e.jsx(s.h2,{children:"Replace OpenCost in the cluster"}),e.jsxs(s.p,{children:["Clients that take a URL need only the two changes above. Clients that reach a Kubernetes Service, ",e.jsx(s.code,{children:"kubectl cost"})," among them, need a Service to reach, and the operator chart ships one. Turn ",e.jsx(s.a,{href:"https://docs.costgraph.ai/costgraph/operator/configuration#opencost-api",children:e.jsx(s.code,{children:"openCostApi"})})," on with an upgrade of the release you already installed, and a proxy Service named ",e.jsx(s.code,{children:"opencost"})," on port 9003 injects the key and answers for this cluster alone."]}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-shell",children:`helm upgrade costgraph-operator costgraph/costgraph-operator \\
  --namespace costgraph \\
  --reuse-values \\
  --set openCostApi.enabled=true
`})}),e.jsxs(s.p,{children:[e.jsx(s.code,{children:"kubectl cost --opencost"})," looks for the Service in the ",e.jsx(s.code,{children:"opencost"}),` namespace, and
this release lives in `,e.jsx(s.code,{children:"costgraph"}),`, so name the Service and its namespace
yourself. Pass `,e.jsx(s.code,{children:"--historical"}),` to see what the window cost, rather than the
monthly rate the plugin projects by default.`]}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-shell",children:`kubectl cost namespace --kubecost-namespace costgraph \\
  --service-name opencost --service-port 9003 \\
  --allocation-path /allocation/compute \\
  --window 1d --historical
`})}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-text",children:`+----------------------------+-------------------+------------------+-----------------+
| CLUSTER                    | NAMESPACE         | TOTAL COST (ALL) | COST EFFICIENCY |
+----------------------------+-------------------+------------------+-----------------+
| cg-opencost-migration-demo | shop              |         0.390820 |        0.000763 |
| __idle__                   | __idle__          |         0.263960 |        0.000000 |
| cg-opencost-migration-demo | costgraph         |         0.114470 |        0.140342 |
|                            | kube-system       |         0.105620 |        0.098248 |
|                            | prometheus-system |         0.008550 |        1.000000 |
|                            | opencost          |         0.006760 |        0.227293 |
+----------------------------+-------------------+------------------+-----------------+
| SUMMED                     |                   |         0.890180 |                 |
+----------------------------+-------------------+------------------+-----------------+
`})}),e.jsx(s.p,{children:`The Service names the cluster, so the plugin sees this cluster's namespaces and
this cluster's idle, not every cluster on the account.`}),e.jsx(s.h2,{children:"Remove OpenCost"}),e.jsx(s.p,{children:"After your clients read from CostGraph and the reporting window you care about is covered, remove OpenCost and the Prometheus you ran for it."}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-shell",children:`helm uninstall opencost --namespace opencost
helm uninstall prometheus --namespace prometheus-system
`})}),e.jsx(s.p,{children:"If other tools read that Prometheus, keep it and remove only OpenCost."}),e.jsx(s.h2,{children:"Clean up"}),e.jsx(s.p,{children:"If you created the EKS cluster for this walkthrough, delete the cluster with the same config file."}),e.jsx(s.pre,{children:e.jsx(s.code,{className:"language-shell",children:`eksctl delete cluster -f cg-opencost.yaml
`})}),e.jsx(s.h2,{children:"Summary"}),e.jsx(s.p,{children:"OpenCost is an extremely useful first step to FinOps, it sure was mine. Cloud spend, however, extends far beyond Kubernetes and knowing how much a single workload costs."}),e.jsxs(s.p,{children:["The ",e.jsx(s.a,{href:"https://docs.costgraph.ai/costgraph/integrations/opencost",children:"OpenCost API"})," page has every route and parameter, and what carries over. The ",e.jsx(s.a,{href:"https://docs.costgraph.ai/costgraph/operator/configuration#opencost-api",children:"operator configuration"})," page covers the in-cluster Service, including the names Kubecost clients look for."]}),e.jsxs(s.p,{children:["If this sounds useful, ",e.jsx(s.a,{href:"https://app.costgraph.ai/create-account",children:"get started for free"})," or ",e.jsx(s.a,{href:"https://cal.com/team/costgraph-team/chat-with-the-costgraph-team",children:"book a demo today"}),"."]}),e.jsx(s.h2,{children:"Frequently Asked Questions"}),e.jsxs(h,{children:[e.jsx(o,{question:"Do my OpenCost clients need code changes?",children:e.jsxs(s.p,{children:["Two settings: the base URL and an ",e.jsx(s.code,{children:"X-API-Key"})," header. The routes, query parameters, and response fields are the ones OpenCost defines. A client that hardcodes ",e.jsx(s.code,{children:"http://opencost:9003"})," needs that value replaced."]})}),e.jsx(o,{question:"Do OpenCost's Grafana dashboards work?",children:e.jsx(s.p,{children:"No. They read OpenCost's Prometheus metrics, and the CostGraph operator doesn't emit that metric family. Read the allocation API or use the CostGraph dashboard."})}),e.jsx(o,{question:"Does kubectl cost work?",children:e.jsxs(s.p,{children:["Yes, once a Service named ",e.jsx(s.code,{children:"opencost"}),` answers in the cluster. The plugin reaches a
Service rather than a URL, so `,e.jsx(s.a,{href:"#replace-opencost-in-the-cluster",children:"Replace OpenCost in the cluster"}),`
turns on the chart's `,e.jsx(s.code,{children:"openCostApi"})," proxy and ",e.jsx(s.code,{children:"kubectl cost"}),` keeps reading it. The
`,e.jsx(s.code,{children:"namespace"}),", ",e.jsx(s.code,{children:"controller"}),", ",e.jsx(s.code,{children:"deployment"}),", ",e.jsx(s.code,{children:"pod"}),", ",e.jsx(s.code,{children:"node"}),", and ",e.jsx(s.code,{children:"label"}),` views all
work. Coming from Kubecost instead, its clients look for a different Service
name, port, and path, and
`,e.jsx(s.a,{href:"https://docs.costgraph.ai/costgraph/operator/configuration#opencost-api",children:e.jsx(s.code,{children:"kubecostCompat"})}),`
answers to those too.`]})}),e.jsx(o,{question:"Which parts of the API aren't served?",children:e.jsxs(s.p,{children:[e.jsx(s.code,{children:"idleByNode"}),` is accepted and ignored; idle is reported for the cluster. The
`,e.jsx(s.code,{children:"/customCost"})," routes aren't served, because ",e.jsx(s.code,{children:"/cloudCost"}),` reports software service
spend next to cloud spend. Everything else carries over, including `,e.jsx(s.code,{children:"filter"}),` and
the storage, network, and load balancer costs on each allocation.`]})}),e.jsx(o,{question:"Do I have to run Prometheus?",children:e.jsx(s.p,{children:"No. The operator ships its own scrapers and remote-writes to CostGraph. If you ran Prometheus only for OpenCost, remove it with OpenCost."})})]})]})]})}function C(t={}){const{wrapper:s}={...r(),...t.components};return s?e.jsx(s,{...t,children:e.jsx(a,{...t})}):a(t)}export{C as default,n as meta};
