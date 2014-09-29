# meteor-terminal

Don't get all so excited. It's not really a tty emulator for meteor. Although original plan was to use `pty.js` for creating a real terminal emulator, but because of time constraints I rolled this thing out in couple hours.  

It's basically a terminal like interface for sending commands to the server. Very insecure, won't support interactive commands etc. It just send commands to server and listen for stdout/stderr for now. It was a requirement for another project which is in beta. I'll probably change it to a more sophisticated version in future. So feel free to play with it, but don't dare to use it in production.

## Usage

```html
{{> terminal}}
```

Put that in any template and you'll get a terminal there. Yea, nothing is configurable for now.
