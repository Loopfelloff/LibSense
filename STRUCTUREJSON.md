# JSON format for REST APIs 

This section contains the json structure attached with both the frontend and the backend

## For backend

### Send the status code as a part of the request object

Send the http response status as a part of the response object not the json attached with it 

For example : 

#### ❌ Bad approach
```
res.json({
    statusCode : 404,
    // rest of the body
})

```

#### ✅ Good approach
```
res.status(404).json({
// rest of the body,
})
```

### Format to send data along with the response object

#### How to send a list of data on success
```
{
 "success" : true, // this could be helpful for logical statements to see if the request was resolved or not 
 "data" :   [
    {
    "id" : 1,
    "title" : "Book A"
}
], 

}
```
#### How to send a response object on failure
```
{
 "success" : false, // this could be helpful for logical statements to see if the request was resolved or not 
 "error" :   
    {
    "errName" : err.name, // this error message is from the try catch block usually for the server side failure, for client side failure exclude both the errName and errMsg only include errDetails, for server side errors exclude the errDetails
    "errMsg" : err.message,
    "errDetails" : {
// This is where you can define your own custome object say for validation failure this is what can be done
    "errField" : "username",
    "errMsg" : "the username must be atleast seven character long"
}
}
, 

}
```
#### For details such as retreiving books or a list of items do this 


```
{
 "success" : true, 
 "data" : [
    // list of objects of book details such as book id , name , author etc.
], 
 "meta" : [
    "total" : total_books_in_db_with_the_matching_condition, // like in facebook which shows that 100 users have been found with the matching username but only 10 is shown due to pagination, useful for retreiving messages only
    "page" : starting_index_of_book,
    "limit" : only_a_certain_lenght_of_books_are_show_first_when_user_clicks_more_the_page_value_is_sent_to_the_server_from_which_more_no_of_book_can_be_retreived 
]
}
, 

}
```
## For Frontend

To be continued...
