# -*- coding: utf-8 -*-
# <nbformat>3.0</nbformat>

# <codecell>

from collections import defaultdict
import csv
import json

# <codecell>

f = open("2014budget-99.csv")
reader = csv.reader(f)
data = [row for row in reader]

# <codecell>

json_data = defaultdict(lambda: 
                        defaultdict(lambda: 
                                    defaultdict(dict)))

for row in data[1:]:
    agency = row[0]
    bureau = row[1]
    account = row[2]
    budget_13 = int(row[3])
    budget_14 = int(row[4])
    if budget_13 == 0 or budget_14 == 0:
        continue
    json_data[agency][bureau][account]["2013"] = int(budget_13)
    json_data[agency][bureau][account]["2014"] = int(budget_14)

# <codecell>

def convert(key, nested_dict):
    result = {"name": key}
    result["children"] = []
    for k, v in nested_dict.items():
        if type(v) is int:
            result[k] = v
        else:
            result["children"].append(convert(k, v))
    if len(result["children"]) == 0:
        result.pop("children")
    return result

# <codecell>

t = [convert(k, v) for k, v in json_data.items()]

# <codecell>

f = open("flare.json", "wb")
json.dump(t, f, indent=2)
f.close()

