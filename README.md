# Esbuild server-side javascript for Enonic XP

## Install

```
yarn add --dev @enonic/esbuild-server-side-js
```

## Usage
Make a file named esbuild.mjs containing:

```
import {esbuildServerSideJs} from '@enonic/esbuild-server-side-js';

esbuildServerSideJs({
	shims: [
		'src/main/resources/lib/nashorn/global.es'
	]
});
```


In build.gradle

```
plugins {
	id 'com.github.node-gradle.node' version '2.2.4'
}

node {
	download = true
	version = '14.10.1'
}

yarn.dependsOn(yarn_install)

task esbuild(type: NodeTask) {
	script file('esbuild.mjs')
}

processResources {
	dependsOn esbuild
	mustRunAfter esbuild
	exclude '**/*.es'
}
```

## Changelog

### 0.1.0

* Handle externals
