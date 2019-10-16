import re

import pytest
from yattag import indent

from .render import dict_as_html


io_pairs = [
    ({'a': 1}, '''
<table>
  <tr>
    <td>a</td>
    <td>1</td>
  </tr>
</table>
'''),
    ({'a': [1, 2]}, '''
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
    ({'a': [1, {'X', 'Y'}]}, '''
<table>
  <tr>
    <td>a</td>
    <td>1, {'Y', 'X'}</td>
  </tr>
</table>
''')
]


@pytest.mark.parametrize('io_pair', io_pairs)
def test_dict_as_html(io_pair):
    (input_dict, expected_output_html) = io_pair
    # CSS classes make output harder to read, obscure the structural issues which are the focus.
    no_class_html = re.sub(r'\s*class="[^"]*"\s*', '', dict_as_html(input_dict))
    assert indent(no_class_html) == expected_output_html.strip()
