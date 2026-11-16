import{j as e,b4 as a}from"./index-DO1J06vb.js";import{M as i}from"./MetaTags-7Rqjl1C2.js";import{P as l}from"./PostLayout-CL0Bqh8X.js";import{u as o}from"./_slug_-B9FXkoW_.js";import"./use-no-widows-CSG_karp.js";import"./post-card-tLmU6kcm.js";const n=a("prometheus-rules");function t(s){const r={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...o(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:n.title,description:n.summary,type:"article",url:n.canonicalUrl,author:n.authors[0],date:n.date,category:n.category,image:n.heroImage}),`
`,e.jsxs(l,{meta:n,children:[e.jsxs(r.p,{children:["In a ",e.jsx(r.a,{href:"/open-sourcing-our-prometheus-client/",children:"previous blog"})," I went over some of the ways Prometheus powers our infrastructure. Continuing on the Prometheus theme, I wanted to talk about a neat feature you might already be using but haven't given much thought to."]}),e.jsx(r.p,{children:"Prometheus rules."}),e.jsx(r.h2,{children:"What is a Prometheus rule?"}),e.jsx(r.p,{children:"Before jumping into a formal definition it is important to establish some context around why this feature exists. Consider the query:"}),e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-promql",children:`sum by (cluster, namespace, pod, container) (
  rate(container_cpu_usage_seconds_total{image!="", container!=""}[5m])
)
/ on (cluster, node) group_left
sum by (cluster, node) (
  kube_node_status_allocatable{resource="cpu"}
)
* on (cluster, node) group_left (instance_type, region)
kube_node_labels
`})}),e.jsx(r.p,{children:"The query above is fine as a one-off. It pulls data from a few sources (cadvisor for container CPU, kube-state-metrics for node capacity, and node labels for instance metadata) and returns a per-container share of CPU annotated with the underlying instance type and region. That is acceptable for a quick check, but if you need to run it every few seconds across thousands of series you do not want to wait minutes for each evaluation."}),e.jsx(r.p,{children:"A much faster approach is to run the query in the background and store the output as a metric of its own."}),e.jsx(r.p,{children:"Prometheus rules are exactly that. They let you compute complex queries ahead of time and define alert conditions on top of them."}),e.jsx(r.p,{children:"Prometheus rules are of two types:"}),e.jsxs(r.ul,{children:[`
`,e.jsx(r.li,{children:"Recording rules"}),`
`,e.jsx(r.li,{children:"Alerting rules"}),`
`]}),e.jsx(r.h3,{children:"Recording rules"}),e.jsx(r.p,{children:"Recording rules let you precompute a large or expensive query and store the output as a regular Prometheus time series. Subsequent queries hit the stored series instead of re-evaluating the original expression, which keeps dashboards snappy and reduces load on the TSDB."}),e.jsx(r.h3,{children:"Alerting rules"}),e.jsxs(r.p,{children:["Alerting rules let you define conditions on metrics and fire when a threshold is crossed. For example, if ",e.jsx(r.code,{children:"request_latency_seconds"})," exceeds 1 for 5 minutes, fire an alert."]}),e.jsxs(r.p,{children:["At Baseline we use recording rules to power ",e.jsx(r.strong,{children:"dynamic cost attribution"}),". Container counts, node capacity, and instance lifetimes all shift constantly in our customers' clusters, so we precompute per-container shares of node CPU and memory, along with node uptime, on a fixed cadence."]}),e.jsx(r.h3,{children:"Understanding recording rule syntax"}),e.jsx(r.p,{children:"Recording rules generally follow this format:"}),e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-yaml",children:`groups:
  - name: <group_name>
    interval: <evaluation_interval>
    rules:
      - record: <new_metric_name>
        expr: <promql_expression>
        labels:
          <label_name>: <label_value>
`})}),e.jsx(r.p,{children:"Where:"}),e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[e.jsx(r.strong,{children:e.jsx(r.code,{children:"name"})})," is the rule group. Rules within a group evaluate sequentially, so later rules can reference series produced by earlier ones."]}),`
`,e.jsxs(r.li,{children:[e.jsx(r.strong,{children:e.jsx(r.code,{children:"interval"})})," sets how often the group evaluates. Defaults to Prometheus's global ",e.jsx(r.code,{children:"evaluation_interval"})," if omitted."]}),`
`,e.jsxs(r.li,{children:[e.jsx(r.strong,{children:e.jsx(r.code,{children:"record"})})," is the name of the new time series the rule produces. By convention this is ",e.jsx(r.code,{children:"level:metric:operations"})," (e.g. ",e.jsx(r.code,{children:"node:cpu:rate5m"}),")."]}),`
`,e.jsxs(r.li,{children:[e.jsx(r.strong,{children:e.jsx(r.code,{children:"expr"})})," is the PromQL expression to evaluate."]}),`
`,e.jsxs(r.li,{children:[e.jsx(r.strong,{children:e.jsx(r.code,{children:"labels"})})," are optional labels merged into every output sample."]}),`
`]}),e.jsx(r.p,{children:"A concrete example, taken from the cost-share group we run in production:"}),e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-yaml",children:`groups:
  - name: costgraph_cost_share
    interval: 5m
    rules:
      - record: container:cpu_share:ratio
        expr: |
          sum by (container, namespace, node) (
            rate(container_cpu_usage_seconds_total{image!=""}[5m])
          )
          /
          on (node) group_left
          sum by (node) (
            kube_node_status_allocatable{resource="cpu"}
          )
`})}),e.jsx(r.p,{children:"Alerting rules follow a similar shape:"}),e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-yaml",children:`groups:
  - name: <group_name>
    rules:
      - alert: <alert_name>
        expr: <promql_expression>
        for: <duration>
        labels:
          severity: <severity>
        annotations:
          summary: <short_description>
`})}),e.jsxs(r.p,{children:["The differences from a recording rule: ",e.jsx(r.code,{children:"alert"})," replaces ",e.jsx(r.code,{children:"record"}),", and ",e.jsx(r.code,{children:"for"})," sets how long the expression must be true before the alert actually fires (suppressing flaps)."]}),e.jsx(r.h2,{children:"Configuring recording rules"}),e.jsxs(r.p,{children:["Getting up and running with rules is fairly straightforward. You create a file (e.g. ",e.jsx(r.code,{children:"rules.yml"}),"), define your rules, and reference the file from your global Prometheus config:"]}),e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-yaml",children:`rule_files:
  - "rules.yml"
`})}),e.jsxs(r.p,{children:["Then validate the file with ",e.jsx(r.a,{href:"https://prometheus.io/docs/prometheus/latest/command-line/promtool/",children:e.jsx(r.code,{children:"promtool"})}),":"]}),e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-bash",children:`promtool check rules rules.yml
`})}),e.jsx(r.p,{children:"After which you can reload or restart the server."}),e.jsxs(r.p,{children:["The problem is that if you prefer one file per rule and you have a few dozen of them, this process quickly becomes error-prone. And the bigger issue for us: it is not programmatic. Every rule change is a config edit, a ",e.jsx(r.code,{children:"promtool"})," invocation, and a reload. That is fine for a handful of static alerts but painful when rules are derived from inventory or tenant state."]}),e.jsx(r.h2,{children:"Introducing Ruler"}),e.jsxs(r.p,{children:["Our solution to this was yet another library: ",e.jsx(r.a,{href:"https://github.com/baselinehq/ruler",children:e.jsx(r.strong,{children:"Ruler"})}),", a small Go package for managing Prometheus rules programmatically."]}),e.jsxs(r.p,{children:["Ruler is scoped to ",e.jsx(r.strong,{children:"recording rules"})," specifically. Alerting rules go through Alertmanager and a separate evaluation path, so they are out of scope here. Since our use case is dynamic cost attribution, which is entirely precomputed series, recording rules are all we need."]}),e.jsxs(r.p,{children:["Ruler treats rule groups as first-class Go values. You construct them, validate them in-process (the same checks ",e.jsx(r.code,{children:"promtool"})," runs), write them out to disk in the layout your Prometheus expects, and trigger a reload, all from one binary. No shell, no templating, no orchestration glue."]}),e.jsx(r.p,{children:"For us that unlocks a few things:"}),e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[e.jsx(r.strong,{children:"Rules derived from state."})," Our cost-attribution rules depend on which clusters, tenants, and node groups are active. Ruler lets us regenerate the rule set whenever inventory changes instead of hand-editing YAML."]}),`
`,e.jsxs(r.li,{children:[e.jsx(r.strong,{children:"Safe rollouts."})," Validation runs before anything touches disk."]}),`
`]}),e.jsx(r.p,{children:"With Ruler, instead of the workflow described above, we can now define rules like so:"}),e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-go",children:`package main

import (
    "context"
    "log"
    "time"

    "github.com/baselinehq/ruler"
)

func main() {
    cfg, err := ruler.ParseConfigFile("rules.yaml")
    if err != nil {
        log.Fatal(err)
    }

    mgr, err := ruler.NewManager(ruler.ManagerConfig{
        Writer:             &logWriter{},
        Context:            context.Background(),
        EvaluationInterval: time.Minute,
    })
    if err != nil {
        log.Fatal(err)
    }
    defer mgr.Stop()

    if err := mgr.Apply(*cfg); err != nil {
        log.Fatal(err)
    }

    select {} // block until shutdown
}
`})}),e.jsxs(r.p,{children:["In the example above we use Ruler to parse a regular rule definition and pass it to a ",e.jsx(r.code,{children:"Manager"}),". This can then be applied to a Prometheus instance, and the subsequent result is handed to a ",e.jsx(r.code,{children:"Writer"})," type."]}),e.jsx(r.h2,{children:"Closing thoughts"}),e.jsx(r.p,{children:"Prometheus rules are a great feature that allows you to not only save time by simplifying queries but also run expensive queries at predetermined times without much overhead during normal operations."}),e.jsx(r.p,{children:"Ruler enabled us to much more freely manipulate and interact with rules through a language we use on a daily basis. If this sounds like it could be useful to you, give it a shot, let us know what you think and leave a star!"})]})]})}function g(s={}){const{wrapper:r}={...o(),...s.components};return r?e.jsx(r,{...s,children:e.jsx(t,{...s})}):t(s)}export{g as default,n as meta};
