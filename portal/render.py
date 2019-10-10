from yattag import Doc


def dict_as_html(input_dict, tagtext=None):
    '''
    Render input_dict as an html table.
    Provide tagtext when recursing, to continue using an existing builder.
    '''
    doc, tag, text = tagtext or Doc().tagtext()

    with tag('table'):
        for key, value in input_dict.items():
            with tag('tr'):
                with tag('td'):
                    text(key)
                with tag('td'):
                    if type(value) == list:
                        if any(type(i) == dict for i in value):
                            with tag('table'):
                                for item in value:
                                    with tag('tr'):
                                        with tag('td'):
                                            dict_as_html(item, (doc, tag, text))
                        else:
                            text(', '.join([str(i) for i in value]))
                    elif type(value) == dict:
                        dict_as_html(value, (doc, tag, text))
                    else:
                        text(value)

    return doc.getvalue()
