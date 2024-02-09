/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const BookModel = require("../models/book");

module.exports = function(app) {

  app.route('/api/books')
    .get(async function(req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await BookModel.find();
        res.json(books);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Interal server error" });
      }

    })

    .post(async function(req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (!title) {
        return res.send("missing required field title");
      }

      try {
        const newBook = new BookModel({ title });
        await newBook.save();
        res.json(newBook)
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Interal server error" });
      }
    })

    .delete(async function(req, res) {
      //if successful response will be 'complete delete successful'
      try {
        const deleteAll = await BookModel.deleteMany({})

        if (!deleteAll) {
          return res.send("could not delete");
        }

        return res.send("complete delete successful");

      } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Interal server error" });
      }
    });



  app.route('/api/books/:id')
    .get(async function(req, res) {
      let bookid = req.params.id || "none";
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        let book;

        if (bookid.match(/^[0-9a-fA-F]{24}$/)) {
          book = await BookModel.findById({ _id: bookid });
        }
        
        if (!book) {
          return res.send("no book exists");
        }

        return res.json(book)
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Interal server error" });
      }
    })

    .post(async function (req, res) {
      let comment = req.body.comment || {};
      let bookid = req.params.id || "none";

      console.log(bookid);
      console.log(comment);
      
      if (comment) {
        if (Object.keys(comment).length === 0){
          return res.send('missing required field comment');
        }
      }

      try {
        let book;


        if (bookid.match(/^[0-9a-fA-F]{24}$/)) {
          book = await BookModel.findById({ _id: bookid });
        }
        
        if (!book) {
          return res.send("no book exists");
        }

        book.comments.push(comment);
        book.commentcount = (book.commentcount || 0) + 1;

        await book.save();
        
        return res.json(book);
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Interal server error" });
      }
    })


    .delete(async function(req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        let deleteBook;

        if (bookid.match(/^[0-9a-fA-F]{24}$/)) {
            deleteBook = await BookModel.findById({ _id: bookid });
        }

        if (!deleteBook) {
          return res.send("no book exists");
        }

        await deleteBook.deleteOne();
        res.send("delete successful")
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Interal server error" });
      }
    });

};
