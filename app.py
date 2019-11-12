#!/usr/bin/env python

from flask import Flask, session

from portal import routes


app = Flask(__name__, instance_relative_config=True)
app.config.from_pyfile('app.conf')
app.register_blueprint(routes.blueprint)

@app.context_processor
def inject_template_globals():
    return {
        'is_authenticated': session.get('is_authenticated')
    }

# actually run the app if this is called as a script
if __name__ == '__main__':
    app.run()
