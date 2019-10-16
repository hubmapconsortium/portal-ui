from yattag import Doc


def object_as_html(input_object, tagtext=None):
    '''
    Render input_object as an html table.
    Provide tagtext when recursing, to continue using an existing builder.
    '''
    doc, tag, text = tagtext or Doc().tagtext()

    def table():
        return tag('table', klass='table table-bordered table-sm')

    def tr():
        return tag('tr')

    def td_key():
        return tag('td', klass='td-key')

    def td_value():
        return tag('td', klass='td-value')

    if type(input_object) == list:
        if all(type(i) == str for i in input_object):
            text(', '.join([str(i) for i in input_object]))
        else:
            with table():
                for item in input_object:
                    with tr():
                        with td_value():
                            object_as_html(item, (doc, tag, text))
    elif type(input_object) == dict:
        with table():
            for key, value in input_object.items():
                with tr():
                    with td_key():
                        text(key)
                    with td_value():
                        object_as_html(value, (doc, tag, text))
    else:
        text(input_object)

    return doc.getvalue()
