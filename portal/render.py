from yattag import Doc


def dict_as_html(input_dict, tagtext=None):
    '''
    Render input_dict as an html table.
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

    with table():
        for key, value in input_dict.items():
            with tr():
                with td_key():
                    text(key)
                with td_value():
                    if type(value) == list:
                        if any(type(i) == dict for i in value):
                            with table():
                                for item in value:
                                    with tr():
                                        with td_value():
                                            dict_as_html(item, (doc, tag, text))
                        else:
                            text(', '.join([str(i) for i in value]))
                    elif type(value) == dict:
                        dict_as_html(value, (doc, tag, text))
                    else:
                        text(value)

    return doc.getvalue()
