select '[' as json
union all
select json + ',' as json from tmpJsonTable
union all
select ']' as json