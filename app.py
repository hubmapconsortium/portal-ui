#!/usr/bin/env python

from portal import create_app


app = create_app()


# actually run the app if this is called as a script
if __name__ == '__main__':
    app.run()
