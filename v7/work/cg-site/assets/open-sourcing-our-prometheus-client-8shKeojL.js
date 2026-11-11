import{j as e,ao as i,b4 as a}from"./index-DsR1DLZc.js";import{M as l}from"./MetaTags-CS1l9i9h.js";import{P as c}from"./PostLayout-D8P_rlRq.js";import{u as s}from"./_slug_-tUH8kxG7.js";import"./use-no-widows-D9jQVwQ8.js";import"./post-card-BbrxDHIA.js";const r=a("open-sourcing-our-prometheus-client");function o(n){const t={a:"a",code:"code",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...s(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(l,{title:r.title,description:r.summary,type:"article",url:r.canonicalUrl,author:r.authors[0],date:r.date,category:r.category,image:r.heroImage}),`
`,e.jsxs(c,{meta:r,children:[e.jsx(t.p,{children:"Of the many open-source projects we leverage, Prometheus is one we use virtually every day, from monitoring our own infrastructure to building a custom metering system. Prometheus is a project we really can't do without."}),e.jsx(t.p,{children:"Not everyone sets out to build a Prometheus client. In our case we started off with the default Golang client, and over time it became clear that our needs quickly outgrew the standard client."}),e.jsx(t.p,{children:"In this blog we will talk about some of our use cases for Prometheus, why we decided to write our own set of libraries, and why we think you should try it out."}),e.jsx(t.h2,{children:"The default route"}),e.jsxs(t.p,{children:["We started out like most people, using ",e.jsx(t.code,{children:"prometheus/client_golang"})," and a handful of community remote write libraries. Notably we also tried ",e.jsx(t.code,{children:"tally"})," from Uber very briefly before dropping it. This worked fine initially. Metrics were collected, pushed upstream, and life was good."]}),e.jsx(t.p,{children:"Then we started building the CostGraph agent."}),e.jsx(t.p,{children:"The agent runs on customer hosts, collects per-process CPU and memory metrics, and ships them to our backend via Prometheus remote write. We had a hard constraint from the start: no external Prometheus dependency. Whoever installs the agent should not need to run a Prometheus server alongside it — essentially, the agent needs to be self-contained."}),e.jsx(t.p,{children:"A major problem is that most of the available clients are not robust."}),e.jsx(t.p,{children:'"Not robust" for our use case means the clients do not handle retries: if there is a network error during a remote write, the metrics collected in that window are just gone, and there is no way to survive a process restart without dropping data. For a monitoring agent that customers depend on, that is not acceptable.'}),e.jsx(t.h2,{children:"How we solved it"}),e.jsxs(t.p,{children:["To combat this we created ",e.jsx(t.code,{children:"remote-write"}),", a Go client for the Prometheus remote_write protocol which ships with two transport layers:"]}),e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Client"})," for immediate synchronous delivery."]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"DurableClient"})," for local disk spooling, restart survival, and background draining."]}),`
`]}),e.jsx(t.h3,{children:"Client"}),e.jsxs(t.p,{children:["The synchronous client handles the common case. You give it a ",e.jsx(t.code,{children:"prometheus.Gatherer"})," and it encodes, compresses, and pushes metrics via ",e.jsx(t.code,{children:"remote_write"}),". Protobuf encoding, snappy compression, and automatic batch splitting are handled for you."]}),e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-go",children:`import (
    "github.com/prometheus/client_golang/prometheus"
    remotewrite "github.com/baselinehq/remote-write"
)

client, err := remotewrite.New(remotewrite.Config{
    UpstreamURL: "http://localhost:9090/api/v1/write",
})
if err != nil {
    log.Fatal(err)
}
defer client.Close()

err = client.Push(ctx, remotewrite.PushRequest{
    Gatherer: prometheus.DefaultGatherer,
    ExternalLabels: map[string]string{
        "job":      "my-daemon",
        "instance": hostname,
    },
})
`})}),e.jsx(t.p,{children:"The client also supports a Forward API for proxy use cases where you receive an incoming remote_write request and stream it to an upstream. In streaming mode there is no buffering — the body is forwarded directly."}),e.jsx(t.h3,{children:"DurableClient"}),e.jsx(t.p,{children:"The durable client is what we built for the CostGraph agent. It solves the problem that made us write this library in the first place."}),e.jsxs(t.p,{children:["When you call ",e.jsx(t.code,{children:"Push"})," or ",e.jsx(t.code,{children:"Enqueue"}),", the payload is persisted to a local disk queue before anything is sent upstream. A background drain loop picks up records and ships them with retry and backoff. If the network goes down, payloads accumulate on disk. When connectivity returns, they drain in FIFO order. No metrics are lost."]}),e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-go",children:`dc, err := remotewrite.NewDurable(remotewrite.DurableConfig{
    Client: remotewrite.Config{
        UpstreamURL:  "https://localhost:9090/api/v1/push",
        TenantHeader: "X-Scope-OrgID",
        Retry: &remotewrite.RetryConfig{
            MinWait: time.Second,
            MaxWait: 30 * time.Second,
        },
    },
    QueueDir:          "/var/lib/my-agent/remotewrite",
    QueueName:         "metrics",
    MaxInMemoryBlocks: 128,
    MaxPendingBytes:   10 * 1024 * 1024 * 1024, // 10 GiB
    SendConcurrency:   1,
})
if err != nil {
    log.Fatal(err)
}
defer dc.Close()

go dc.Run(context.Background())

// Push periodically
ticker := time.NewTicker(15 * time.Second)
for range ticker.C {
    dc.Push(ctx, remotewrite.PushRequest{
        TenantID: "tenant-a",
        Gatherer: prometheus.DefaultGatherer,
        ExternalLabels: map[string]string{
            "job":      "my-agent",
            "instance": hostname,
        },
    })
}
`})}),e.jsx(t.p,{children:"The durable layer does not require Prometheus internals or a second process. It is self-contained, just like the agent."}),e.jsx(t.h2,{children:"On performance"}),e.jsxs(t.p,{children:["Not only did we want more from our Prometheus client — performance was critical from day one. ",e.jsx(t.code,{children:"remote-write"})," is optimized for low allocation counts and minimal GC pressure. A few of the things we do:"]}),e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:["Pooled ",e.jsx(t.code,{children:"io.ReadCloser"})," wrappers and timer pools to reduce allocations under sustained load."]}),`
`,e.jsx(t.li,{children:"Retry buffers with size classes to avoid repeated large allocations."}),`
`,e.jsx(t.li,{children:"Reusable protobuf, label, and compression output buffers across encode cycles."}),`
`,e.jsx(t.li,{children:"Automatic batch splitting to avoid oversized payloads while minimizing HTTP round trips."}),`
`]}),e.jsx(t.p,{children:"Here's a quick snapshot of some numbers on an Apple M3 Pro:"}),e.jsx(i,{src:"/posts/prometheus-client-benchmarks.svg",alt:"remote-write benchmarks: ClientOnly streaming 596 ns, Encode 100 counters 24,228 ns, Forward streaming 41,080 ns, Push small batch 47,476 ns. Throughput peaks around 110 GB/s on client-only.",className:"my-8 w-full rounded-xl"}),e.jsx(t.h2,{children:"Closing"}),e.jsxs(t.p,{children:["The library is available at ",e.jsx(t.a,{href:"https://github.com/baselinehq/remote-write",children:"this repo"}),". We use it in production every day across the CostGraph agent and operator."]}),e.jsx(t.p,{children:"If you are working with Prometheus remote write and need something more robust than what is currently available, give it a try. Contributions and feedback are welcome."})]})]})}function w(n={}){const{wrapper:t}={...s(),...n.components};return t?e.jsx(t,{...n,children:e.jsx(o,{...n})}):o(n)}export{w as default,r as meta};
