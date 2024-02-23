

https://user-images.githubusercontent.com/33033422/216776250-04ef297b-f61a-42ec-a7b9-b08e46dddf8f.mp4

# [Next.js Starter Kit with tRPC](https://liveblocks.io/starter-kit)

<p>
  <a href="https://codesandbox.io/s/github/liveblocks/liveblocks/tree/main/starter-kits/nextjs-starter-kit">
    <img src="https://img.shields.io/badge/open%20in%20codesandbox-message?style=flat&logo=codesandbox&color=333&logoColor=fff" alt="Open in CodeSandbox" />
  </a>
  <img src="https://img.shields.io/badge/react-message?style=flat&logo=react&color=0bd&logoColor=fff" alt="React" />
  <img src="https://img.shields.io/badge/next.js-message?style=flat&logo=next.js&color=07f&logoColor=fff" alt="Next.js" />
</p>

Kickstart start your collaborative Next.js app with this starter kit.

## Features

- Documents dashboard with pagination, drafts, groups, auto-revalidation
- Collaborative whiteboard app with a fully-featured share menu
- Authentication compatible with GitHub, Google, Auth0, and more
- Document permissions can be scoped to users, groups, and the public

## Get started

[Read the guide](http://liveblocks.io/docs/guides/nextjs-starter-kit) to get
started.

## Source

This is an extension of the liveblocks [starter kit](https://liveblocks.io/starter-kit) for next.js, with tRPC for simple code.

[tRPC](https://trpc.io/) provides a better DX by having end-to-end type safety.

See this [PR](https://github.com/antoinewg/liveblocks-trpc-starter-kit/pull/3) to see the full migration process.

## Roadmap

- [ ] replaces call to `fetchLiveblocksApi` and use `@liveblocks/node` client and types directly
