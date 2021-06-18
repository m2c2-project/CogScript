## GList

GList is a class that allows easy access to lists. The list should contain all the same type.

Functions:

### Constructor

    myList = new GList();

### Add(val:Any)

Adds a value to the list.

### AddAll(arr:[Any])

Adds an entire array.

### Set(index:Int, val:Any)

Sets a value at a given index.

### Get(index:Int)

Gets the value at the given index.

### GetSize()

Gets the number of entries in the list

### PopFirst()

Get the first entry in the list and remove it.

### Remove(index:Int)

Removes the given entry at index.

### RemoveAll()

Removes all entries.

### GetRandom()

Gets a random entry.

### PopRandom()

Gets a random entry and removes it.

### Randomize()

Randomizes the list order.

### FindElement(element:Any)

Searches the list for the element and returns the index if found, otherwise returns -1

### Contains(element:Any)

Returns true if the list contains the given element.