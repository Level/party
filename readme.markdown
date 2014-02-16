# level-multihandle

open a leveldb handle multiple times, transparently upgrading to use
[multilevel](https://npmjs.org/package/multilevel) when more than 1 process try
to use the same leveldb data directory at once

