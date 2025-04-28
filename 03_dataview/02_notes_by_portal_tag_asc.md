``` dataview
TABLE 
    dateformat(file.mtime, "yyyy-MM-dd, HH:mm") AS "更新日時",
    file.name AS "ファイル名"
FROM "02_notes"
WHERE contains(file.tags, "Portal")
SORT file.name ASC

```
