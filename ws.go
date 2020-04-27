package main

import (
	db_ "demo/DB"
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/lann/ps"
	"io/ioutil"
	"net/http"
	"time"
)
type Message struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Message  string `json:"message"`
}

//type Room struct {
//	Id string `json:"id"`
//	Status string `json:"status"`
//}

// jwtCustomClaims are custom claims extending default ones.
type jwtCustomClaims struct {
	Name  string `json:"name"`
	Password string   `json:"password"`
	jwt.StandardClaims
}

type isLogin struct {
	IsLogin bool `json:"isLogin"`
}

type usersOnline struct {
	Listonline string `json:"listonline"`
	Timeonline string `json:"timeonline"`
}

// config origin cho ws
var (
	upgrader =  websocket.Upgrader{   CheckOrigin: func(r *http.Request) bool {
		return true
	},}

)
//tạo 1 map clinets có key là ws và value là bool
var clients = make(map[*websocket.Conn]bool) // connected clients
// tọa 1 broadcast chanel hứng msg
var broadcast = make(chan Message)           // broadcast channel

var usersonline  []usersOnline
var cookie *http.Cookie
func hello(c echo.Context) error {
	//for _, cookie := range c.Cookies() {
	//	fmt.Println(cookie.Name)
	//	fmt.Println(cookie.Value)
	//}
		ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil, )
		if err != nil {
			return err
		}
		defer ws.Close()
		// bỏ vô map clients key ws 1 vs value bằng true
		clients[ws] = true
		for {
			cookie, err = c.Cookie("username")
			if err != nil {
				return err
			}
			fmt.Println("cookie", cookie)

			// Reads
			var msg Message
			err = ws.ReadJSON(&msg.Message)
			if err != nil {
				fmt.Println(err)
				delete(clients, ws)
				break
			}
			fmt.Printf(">>>>>>>>>%s\n", msg.Message)

			// send msg to broadcast
			broadcast <- Message{Message: msg.Message}

		}

	return c.String(http.StatusOK,"")
}

func handleMessages() {
	for {
		// get msg from broadcast

		msg := <-broadcast
		//fmt.Println("roomid select >>>" , <-roomid)
		// gửi tất cả những client connected
		for client := range clients {
			err := client.WriteJSON( cookie.Value + ":" + msg.Message)
			fmt.Println("số clients:::" , clients)
			if err != nil {
				fmt.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
		fmt.Println("msg in:")
	}
}


func login(c echo.Context) error {


	// get data from body
	data, _ := ioutil.ReadAll(c.Request().Body)

	userLogin := db_.User{}

	json.Unmarshal(data,&userLogin)

	fmt.Println("data",string(data))

	db := db_.ConnectDB()

	sqlStatement := "SELECT id, name, password FROM User WHERE id =" + userLogin.Id

	rows, err := db.Query(sqlStatement)

	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusCreated, err);
	}
	defer rows.Close()

	user := db_.User{}

	for rows.Next() {

		err2 := rows.Scan(&user.Id, &user.Name, &user.Pw)
		fmt.Println(">>>> user: ",user)
		// Exit if we get an error
		if err2 != nil {
			fmt.Print(err2)
		}
	}

	fmt.Println(userLogin)

	// Throws unauthorized error
	if userLogin.Pw != user.Pw {
		return echo.ErrUnauthorized
	}
	expiration := time.Now().Add(365 * 24 * time.Hour)
	cookie1    :=    http.Cookie{Name: "username",Value:userLogin.Id,Expires:expiration}
	http.SetCookie(c.Response(), &cookie1)

	//cookie := new(http.Cookie)
	//cookie.Name = "username"
	//cookie.Value = user.Id
	//cookie.Expires = time.Now().Add(24 * time.Hour)
	//c.SetCookie(cookie)
	// Create token
	token := jwt.New(jwt.SigningMethodHS256)

	// Set claims
	claims := token.Claims.(jwt.MapClaims)
	claims["name"] = userLogin.Id
	claims["password"] = userLogin.Pw
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte("secret"))
	if err != nil {
		return err
	}
	onl := usersOnline{
		Listonline: user.Id ,
		Timeonline: time.Now().String(),
	}
	usersonline = append(usersonline,onl)

	fmt.Println("oooooooooooo",usersonline)
	return c.JSON(http.StatusOK, map[string]ps.Any{
		"token": t,
		"isLogin": true,
	})
}

func getdata(c echo.Context) error {

	return c.JSON(http.StatusOK, map[string][]usersOnline{
		"usersonline": usersonline,
	})
}

//func getListRoom(c echo.Context) error {
//	userID := c.Param("userID")
//	fmt.Println(">>>>>>>>>>>",userID)
//	db := db_.ConnectDB()
//
//	sqlStatement := "SELECT roomid FROM roomuser WHERE userid =" + userID
//
//	rows, err := db.Query(sqlStatement)
//
//	if err != nil {
//		fmt.Println(err)
//		return c.JSON(http.StatusCreated, err);
//	}
//	defer rows.Close()
//
//	listroom := []int{}
//	for rows.Next() {
//		var i int
//		err2 := rows.Scan(&i)
//		fmt.Println(">>>> listroom: ",listroom)
//		// Exit if we get an error
//		if err2 != nil {
//			fmt.Print(err2)
//		}
//		listroom = append(listroom, i)
//	}
//	return c.JSON(http.StatusOK, map[string]ps.Any{
//		"userID": userID,
//		"listroom": listroom,
//	})
//}

//func selectRoom(c echo.Context) error {
//		roomid = c.Param("roomid")
//
//	return c.String(http.StatusOK,"ok")
//}

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.POST("app/login", login)

	room := e.Group("app/chatroom")
	// Configure middleware with the custom claims type
	config := middleware.JWTConfig{
		Claims:     &jwtCustomClaims{},
		SigningKey: []byte("secret"),
	}
	room.Use(middleware.JWTWithConfig(config))



	room.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:1323"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

	//e.GET("app/chatroom/listroom/:userID",getListRoom)
	//e.GET("app/chatroom/selectroom/:roomid",selectRoom)
	room.GET("/",getdata)
	e.GET("/ws", hello)
	// wait msg từ hello
	go handleMessages()
	e.Logger.Fatal(e.Start(":1323"))
}
