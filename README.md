# \<xgd-table-of-contents\>

Provides a Polymer 2 table of contents for use in a document library or other such use.

Example:
<!---
```
<xgd-table-of-contents id="toc"
    linkicon="icons:chevron-right" 
    opened="icons:expand-more" 
    closed="icons:expand-less">
</xgd-table-of-contents>

<script>
    var data = {
        "Title": "Table Of Contents",
        "Link": "",
        "Chapters": [
        {
            "Title": "Chapter A",
            "Link": "",
            "Chapters": [
                {
                    "Title": "Section 1",
                    "Link": "http://d.com"
                },
                {
                    "Title": "Section 2",
                    "Link": "http://z.com"
                },
                {
                    "Title": "Section 3",
                    "Link": "http://ddddd.com"
                }
            ]
        },
        {
            "Title": "Chapter 2",
            "Link": "",
            "Chapters": [
                {
                    "Title": "Section 1",
                    "Link": "http://aaa.com"
                },
                {
                    "Title": "Section 2",
                    "Link": "http://sss.com"
                },
                {
                    "Title": "Section 3",
                    "Link": "http://ddd.com"
                }
            ]
        }
      ]
    }
    this.$.toc.LoadTableOfContents(data);
</script>
```
-->

### Styling

The following custom properties and mixins are available for styling.

| Custom property | Description | Default |
| --- | --- | --- |
| `--toc-font-size` | Font size for the menus | 1em |
| `--app-primary-color` | Primary Color of your App | #000 |
| `--app-dark-primary-color` | Dark Version Primary Color of your App | #000 |
| `--app-lite-primary-color` | Light Version Primary Color of your App. | #fff |

