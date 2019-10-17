import re

import pytest
from yattag import indent

from .render import object_as_html


io_pairs = [
    ({'a': 1}, '''
<table>
  <tr>
    <td>a</td>
    <td>1</td>
  </tr>
</table>
'''),
    ({'a': ['1', '2']}, '''
<table>
  <tr>
    <td>a</td>
    <td>1, 2</td>
  </tr>
</table>
'''),
    ({'a': {'b': 'c'}}, '''
<table>
  <tr>
    <td>a</td>
    <td>
      <table>
        <tr>
          <td>b</td>
          <td>c</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
'''),
    ({'a': [1, {'X': 'Y'}]}, '''
<table>
  <tr>
    <td>a</td>
    <td>
      <table>
        <tr>
          <td>1</td>
        </tr>
        <tr>
          <td>
            <table>
              <tr>
                <td>X</td>
                <td>Y</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
''')
]


@pytest.mark.parametrize(
    'input_object,expected_output_html', io_pairs,
    ids=lambda val: str(val) if type(val) == dict else '')
def test_object_as_html(input_object, expected_output_html):
    # Remove CSS classes to make it easier to read/compare.
    no_class_html = re.sub(r'\s*class="[^"]*"\s*', '', object_as_html(input_object))
    assert indent(no_class_html) == expected_output_html.strip()
