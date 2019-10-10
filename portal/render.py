from yattag import Doc


def dict_as_html(input_dict):
    doc, tag, text = Doc().tagtext()

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
                                    with tag('td'):
                                        text('TODO: recurse')
                        else:
                            text(', '.join(value))
                    elif type(value) == dict:
                        text('TODO: recurse')
                    else:
                        text(value)

    return doc.getvalue()
