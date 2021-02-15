#
# Minify JSON data files in the `/dist` directory.
# Script invoked by the npm postbuild script after building the project with `npm run build`.
#

from os import (
    path,
    listdir,
    fsdecode
)
import json
from datetime import datetime


class JSONMinifier:
    DIST_CONSTITUENT_DATA_DIRECTORY = path.abspath(path.join(path.dirname(__file__), '..', 'dist', 'assets', 'data'))
    DIST_SNAPSHOT_DATA_DIRECTORY = path.abspath(path.join(path.dirname(__file__), '..', 'dist', 'assets', 'data'))

    def minify_json(self, directory):
        for file in listdir(directory):
            filename = fsdecode(file)
            if filename.endswith(".json"):
                with open(path.join(directory, filename), "r+") as f:
                    data = json.loads(f.read())
                    f.seek(0)
                    f.write(json.dumps(data, separators=(',', ':')))
                    f.truncate()
                    print(f"{datetime.now().strftime('%Y/%m/%d %H:%M:%S')} | Minified {filename}")


if __name__ == '__main__':
    minifier = JSONMinifier()
    minifier.minify_json(minifier.DIST_CONSTITUENT_DATA_DIRECTORY)
    minifier.minify_json(minifier.DIST_SNAPSHOT_DATA_DIRECTORY)
