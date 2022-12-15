package main

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
)

type Post struct {
	Id     int    `json:"id"`
	Title  string `json:"title"`
	Body   string `json:"body"`
	Author string `json:"author"`
}

var Db *sql.DB
func init() {
	var err error
	Db, err = sql.Open("sqlite3", "./example.sqlite")

	if err != nil {
		panic(err)
	}
}

func getPosts(limit int) (posts []Post, err error) {
	stmt := "SELECT id, title, body, author FROM posts LIMIT $1"
	rows, err := Db.Query(stmt, limit)
	if err != nil {
		return
	}

	for rows.Next() {
		post := Post{}
		err = rows.Scan(&post.Id, &post.Title, &post.Body, &post.Author)
		if err != nil {
			return
		}
		posts = append(posts, post)
	}
	rows.Close()
	return
}

// retrieve get a specified post.
func retrieve(id int) (post Post, err error) {
	post = Post{}
	stmt := "SELECT id, title, body, author FROM posts WHERE id = $1"
	err = Db.QueryRow(stmt, id).Scan(&post.Id, &post.Title, &post.Body, &post.Author)
	return
}

// create a new post.
func (post *Post) create() (err error) {
	stmt := "INSERT INTO posts (title, body, author) values ($1, $2, $3) RETURNING id"
	err = Db.QueryRow(stmt, post.Title, post.Body, post.Author).Scan(&post.Id)
	return
}

// update a specified post.
func (post *Post) update() (err error) {
	stmt := "UPDATE posts set title = $1, body = $2, author = $3 WHERE id = $4"
	_, err = Db.Exec(stmt, post.Title, post.Body, post.Author, post.Id)
	return
}

// delete a specified post.
func (post *Post) delete() (err error) {
	stmt := "DELETE FROM posts WHERE id = $1"
	_, err = Db.Exec(stmt, post.Id)
	return
}