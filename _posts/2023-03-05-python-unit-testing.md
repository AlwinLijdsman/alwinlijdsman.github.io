---
title: 'Unit testing in Python'
date: 2023-03-05 00:00:00
description: How to apply unit tests in Python.
featured_image: '/images/python_logo_extras.png'
---

Unit testing is an essential part of software development, and pytest is a popular testing framework in Python. As a data hero, you want to use unit testing whenever you create code that you know you are going to use in the future. For example, when creating functions. In this article, we'll cover the basics of unit testing with pytest and show you how to write a basic test.


## Setting up pytest
First, we need to install pytest. You can do this using **pip** through your terminal:

```bash
$ pip install pytest
```

After installing pytest, you can create a test file with the following naming convention: test_<filename>.py. This is important as pytest will look for files with this naming convention when running tests.

## Writing tests
Let's start by writing a simple test for a function that adds two numbers:

```python
def add_numbers(a, b):
    return a + b

def test_add_numbers():
    assert add_numbers(2, 3) == 5
```

In this example, we define a function called add_numbers that takes two arguments and returns their sum. We then define a test function called test_add_numbers using the pytest naming convention. The test function uses the assert keyword to check that add_numbers(2, 3) returns 5. If the assertion fails, pytest will report an error.

|---|
**Tip**: If you are new to Python programming and you need
a refresher on functions: Take a look at the
*Python basics - Functions* section in the Data Handbook:
https://www.datahandbook.site/

|---|


## Running tests
To run the tests, navigate to the directory where your test file is located and run the following command:

```bash
$ pytest
```

Pytest will automatically detect and run any tests in files with the test_<filename>.py naming convention. You should see output similar to the following:

<img src="/images/article_images/python-unit-testing/pytest-test.PNG" width="450"/>

This output shows that pytest has found and run one test, and that the test has passed.

---

**Tip**: You don't have to come up with writing tests yourself. Once you have created your function, just give the function to ChatGPT and ask ChatGPT to write some tests for you. This can save a lot of time!

---

## Testing exceptions
Sometimes you want to test that a function raises an exception under certain conditions. Here's an example of how to do that in pytest:

```python
import pytest

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(1, 0)
```

In this example, we define a function called divide that takes two arguments and returns their quotient. If the second argument is zero, the function raises a ValueError. We then define a test function called test_divide_by_zero that uses the pytest.raises context manager to check that calling divide(1, 0) raises a ValueError.



## How to use

That's all there is to it! Now the question is: when do I create test? The answer is: always! Every time that you create a function, which is like building an new piece of Python functionality, you also build out a test.