#!/usr/bin/env python

from flask import Flask

from portal import routes


app = Flask(__name__, instance_relative_config=True)
app.config.from_pyfile('app.conf')
app.register_blueprint(routes.blueprint)

# actually run the app if this is called as a script
if __name__ == '__main__':
    app.run()
