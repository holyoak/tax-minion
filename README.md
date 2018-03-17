![](https://github.com/holyoak/cryptominion/blob/master/src/client/assets/logo.svg)
# tax-minion

> Calculate cryptocurrency trading taxes and profits in Node or Python


## NodeJs version

Instructions for Linux & Mac.  Windows pull request welcomed.

This project currently requires Node 8!  If it is not working check your Node version!

```node -v```


### To install

Check if you have an SSH keypair

```ls ~/.ssh```

and look for a file named 'id_rsa.pub'

IF you do not have this file, generate an SSH keypair

```ssh-keygen -t rsa -C "PASSWORD_HINT.THAT.LOOKS.LIKE.AN@EMAIL.net"```

THEN contact me with the .pub key and I will add you to the repo

then append to or create the file '~/.ssh/config' so it contains

```host git.holyoak
    user git
    hostname holyoak.net
    port 7822
    identityfile ~/.ssh/id_rsa
```

then

```git clone git.holyoak:tax-minion```

then

```cd tax-minion && npm i```

### To run the app

```npm run dev```

