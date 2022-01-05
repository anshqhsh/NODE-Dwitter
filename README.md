API Spec

# Tweets
Tweet Schema
  {
    id: string,  // 트윗 아이디
    text: string,  // 트윗 텍스트
    createdAt: Date, // 트윗 생성 날짜
    name: string,  // 사용자 이름
    username: string,  // 사용자 닉네임 (아이디)
    url: string (optional) // 사용자 프로파일 사진 URL
  }

GET/tweets - get all tweets 트윗을 배열 형태로 받을 수 있음
  Response `200`
  {
    [tweet, tweet ....] 
  }

GET/tweets?username=:username- get all tweets for user's username 해당하는 유저의 트윗을 보기
  Response 200
  {
    [tweet, tweet ....] 
  }
  
GET/tweets/:id - get tweet by id
  Response 200
  {
    tweet
  }
  
POST/tweets - creating new tweet
  Request 
  {
    text,
    name,
    username,
    url, (optinal)
  }  
  Response 201
  {
       tweet
  }
  
PUT/tweets/:id - updating tweet
  Request
  {
    text
  }
  Response 200
  {
     tweet
  }
  
DELETE/tweets/:id - updating tweet
  Response 204
    
# Auth
User Schema
  json
  {
    id: string // 사용자의 고유한 아이디
    username: string,  // 사용자 닉네임 (아이디)
    password: string,  // 사용자 비밀번호
    name: string,  // 사용자 이름
    email: string,  // 사용자 이메일
    url: string (optional) // 사용자 프로파일 사진 URL
  }

POST/auth/signup

Reqeust json
{
	username,
	password,
  name,
  email,
  url
}

Response json
{
	token,
	username
}

POST/auth/login

Reqeust json
{
	username,
	password
}

Response json
{
	token,
	username
}

GET/auth/me 
json
{
	token,
	username
}
