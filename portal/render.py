from yattag import Doc


def dict_as_html(input_dict):
    doc, tag, text = Doc().tagtext()

    with tag('table'):
        for k, v in input_dict.items():
            with tag('tr'):
                with tag('td'):
                    text(k)
                with tag('td'):
                    text(str(v))

    return doc.getvalue()
