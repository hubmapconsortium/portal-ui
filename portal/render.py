from yattag import Doc


def dict_as_html(input_dict, tagtext=None):
    '''
    Render input_dict as an html table.
    Provide tagtext when recursing, to continue using an existing builder.
    '''
    doc, tag, text = tagtext or Doc().tagtext()

    def table():
        return tag('table', klass='table table-bordered')
    def tr():
        return tag('tr')
    def td():
        return tag('td')

    with table():
        for key, value in input_dict.items():
            with tr():
                with td():
                    text(key)
                with td():
                    if type(value) == list:
                        if any(type(i) == dict for i in value):
                            with table():
                                for item in value:
                                    with tr():
                                        with td():
                                            dict_as_html(item, (doc, tag, text))
                        else:
                            text(', '.join([str(i) for i in value]))
                    elif type(value) == dict:
                        dict_as_html(value, (doc, tag, text))
                    else:
                        text(value)

    return doc.getvalue()
