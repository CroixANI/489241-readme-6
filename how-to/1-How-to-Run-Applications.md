# Table of Contents  
* [Pre-Requisite](#pre-Requisite)  
* [Обзор](#overview)  
* [Запуск через Dev Container](#run-dev-container)  
* [Запуск через Docker Compose](#run-docker-compose)  
* [Запуск приложений](#run-apps)  
  * [Используя make](#run-make-apps)  
  * [Используя nx](#run-nx-serve)  
* [Конфигурация приложений](#configuration)  
  * [API Gateway](#api-config)  
  * [Account](#account-config)  
    * [Seed пользователей](#account-seed)  
  * [Blog](#blog-config)  
    * [Seed данных](#blog-seed)
  * [File Vault](#file-vault-config)  
  * [Notify](#notify-config)  

<a name="pre-Requisite"/>

# Pre-Requisite
* Docker
* Docker Compose
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

<a name="overview"/>

# Обзор

В данном проекте есть два варианта запуска приложений
* Docker Compose
* Dev Container

Оба подхода используют один и тот же `docker-compose.yml` файл. Только в случае с Dev Container еще загружается и настраевается среда для разработки через VS Code с установленными `nx`, `npm`.

<a name="run-dev-container"/>

# Запуск через Dev Container

* Откройте VS Code
* Установите пакет с расширениями [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) от Microsoft
* Откройте папку с кодом. После VS Code предложит переоткрыть проект в Dev Container-е, как показано ниже. Согласитесь.

![VS Code Suggestion](../images/04-vscode-hint-reopen-in-container.png)

* Если предыдущий вариант не сработал, то можно самастоятельно переоткрыть проект в Dev Container-е, как показано ниже. Используйте ссылку в нижнем левом углу VS Code

![Green bar](../images/05-vscode-remote-dev-bar.png)

* В открывшемся меню нажмите на "Reopen in container", как показано ниже

![Open in Container](../images/06-vscode-reopen-in-container.png)

<a name="run-docker-compose"/>

# Запуск через Docker Compose

1. Открыть в терминале папке с проекта
2. Перейти в папке `project`
3. Выполнить комманду `sudo docker compose --env-file "./.env-example" --file "./docker-compose.yml" up -d`
5. Займет какое-то время прежде чем он запустит все службы и БДых

<a name="run-apps"/>

# Запуск приложений

<a name="run-make-apps"/>

## Используя `make`

`make run-apps` - это команда запустить 5 приложений: api, account, blog, file-vault, notify

<a name="run-nx-serve"/>

## Используя `nx`

Можно запустить каждое приложение в отдельном окне терменала командой `nx run <app-name>:serve`

```cmd
nx run account:serve
nx run api:serve
nx run blog:serve
nx run file-vault:serve
nx run notify:serve
```

<a name="configuration"/>

# Конфигурация приложений

Ниже список переменных окружений

<a name="api-config"/>

## API Gateway

Пример всех необходимых переменных окружений находится в файле `project/apps/api/.env-example`. Для работы приложения нужно создать файл `project/apps/api/api.env` и можно скопировать данные в него из файла `project/apps/api/.env-example`. 

* `API_PORT` - номер порта на котором будет запущено приложение. В файле установлен в `3000`
* `API_ENVIRONMENT` - тип окружения. В файле установлен в `development`. Есть еще `production` и `stage`
* `BASE_ACCOUNT_URL` - базовый URL указывающий на API сервиса **Account**. В файле установлен в `http://localhost:3001/api`
* `BASE_BLOG_URL` - базовый URL указывающий на API сервиса **Blog**. В файле установлен в `http://localhost:3002/api`

<a name="account-config"/>

## Account

Пример всех необходимых переменных окружений находится в файле `project/apps/account/.env-example`. Для работы приложения нужно создать файл `project/apps/account/account.env` и можно скопировать данные в него из файла `project/apps/account/.env-example`. 

### Переменные окружения для запуска Account сервиса
* `ACCOUNT_PORT` - номер порта на котором будет запущено приложение. В файле установлен в `3001`
* `ACCOUNT_ENVIRONMENT` - тип окружения. В файле установлен в `development`. Есть еще `production` и `stage`

### Переменные окружения для работы с БД Mongo

* `MONGO_DB` - название коллекции в БД Mongo. Для этого сервиса в файле прописана `readme-users`.
* `MONGO_HOST` - название сервера БД Mongo. В файле прописано `mongodb`, что совпадает с названием сервиса описанного в `project/docker-compose.yml` файле.
* `MONGO_PORT` - номер порта по которому сервис будет соеденяться с БД Mongo. В файле установлен в `27017`, что совпадает с конфигурацией сервиса `mongodb` описанного в `project/docker-compose.yml` файле.
* `MONGO_USER` - имя пользователя под которым сервис будет соеденяться с БД Mongo. В файле установлен в `admin`, что совпадает с конфигурацией сервиса `mongodb` описанного в `project/docker-compose.yml` файле.
* `MONGO_PASSWORD` - пароль пользователя под которым сервис будет соеденяться с БД Mongo. В файле установлен в `admin`, что совпадает с конфигурацией сервиса `mongodb` описанного в `project/docker-compose.yml` файле.
* `MONGO_AUTH_BASE` - имя коллекции под которой сервис будет соеденяться с БД Mongo. В файле установлен в `admin`, что совпадает с конфигурацией сервиса `mongodb` описанного в `project/docker-compose.yml` файле.

### Переменные окружения для работы с текущей реализацией JWT токенов

* `JWT_ACCESS_TOKEN_SECRET` - пароль для генерации и проверки Access Token-а
* `JWT_ACCESS_TOKEN_EXPIRES_IN` - период действия Access Token-а
* `JWT_REFRESH_TOKEN_SECRET` - пароль для генерации и проверки Refresh Token-а
* `JWT_REFRESH_TOKEN_EXPIRES_IN` - период действия Refresh Token-а

### Переменные окружения для работы с RabbitMQ

* `RABBIT_HOST` - название сервера RabbitMQ. В файле прописано `rabbitmq`, что совпадает с названием сервиса описанного в `project/docker-compose.yml` файле.
* `RABBIT_PORT` - номер порта по которому сервис будет соеденяться с RabbitMQ. В файле установлен в `5672`, что совпадает с конфигурацией сервиса `rabbitmq` описанного в `project/docker-compose.yml` файле.
* `RABBIT_USER` - имя пользователя под которым сервис будет соеденяться с RabbitMQ. В файле установлен в `admin`, что совпадает с конфигурацией сервиса `rabbitmq` описанного в `project/docker-compose.yml` файле.
* `RABBIT_PASSWORD` - пароль пользователя под которым сервис будет соеденяться с RabbitMQ. В файле установлен в `admin`, что совпадает с конфигурацией сервиса `rabbitmq` описанного в `project/docker-compose.yml` файле.
* `RABBIT_QUEUE` - название очереди
* `RABBIT_EXCHANGE` - название exchange

<a name="account-seed"/>

### Заполнение БД первыми данными

Пример конфигурации для `project/libs/account/blog-user/src/lib/seed/seed.ts` лежит в файле `project/libs/blog/models/prisma/.env-example` нужно указать следующие данные

* `DATABASE_URL` - URL по которому `seed.ts` будет соединяться с БД Mongo. Как пример `postgres://postgres:postgres@localhost:5432/readme-blog`

Команда для запуска seed скрипта

* `nx run account:db-fill`

<a name="blog-config"/>

## Blog

Пример всех необходимых переменных окружений находится в файле `project/apps/blog/.env-example`. Для работы приложения нужно создать файл `project/apps/blog/blog.env` и можно скопировать данные в него из файла `project/apps/blog/.env-example`. 

* `BLOG_PORT` - номер порта на котором будет запущено приложение. В файле установлен в `3002`
* `BLOG_ENVIRONMENT` - тип окружения. В файле установлен в `development`. Есть еще `production` и `stage`

### Конфигурация для Prisma для работы с PostgreSQL

Пример конфигурации распаложен в файле `project/libs/blog/models/prisma/.env-example`. Нужно создать файл `project/libs/blog/models/prisma/.env` и указать следущие переменные окружения

* `DATABASE_URL` - URL для соединения с PostgreSQL. Как пример `postgres://postgres:postgres@postgresdb:5432/readme-blog`

<a name="account-seed"/>

# Заполенение БД первыми данными

После настройки переменных окружения для Prisma можно будет запускать следущие команды

* `nx run blog:db-validate` - проверяет схему описанную в файле `project/libs/blog/models/prisma/schema.prisma`
* `nx run blog:db-migrate` - запускает миграции
* `nx run blog:db-reset` - сбрасывает БД
* `nx run blog:db-generate` - генерирует клиентский код
* `nx run blog:db-fill` - запускает скрипт `project/libs/blog/models/prisma/seed.ts` для создания первых данных в БД

<a name="file-vault-config"/>

# File Vault

Пример всех необходимых переменных окружений находится в файле `project/apps/file-vault/.env-example`. Для работы приложения нужно создать файл `project/apps/file-vault/file-vault.env` и можно скопировать данные в него из файла `project/apps/file-vault/.env-example`. 

### Переменные окружения для запуска File Vault сервиса

* `FILE_VAULT_PORT` - номер порта на котором будет запущено приложение. В файле установлен в `3003`
* `FILE_VAULT_ENVIRONMENT` - тип окружения. В файле установлен в `development`. Есть еще `production` и `stage`
* `UPLOAD_DIRECTORY_PATH` - полный путь к папке где будут сохраняться файлы. Указан как `/workspaces/489241-readme-6/project/apps/file-vault/uploads` так как проект в основном запускается в Dev Container-е.
* `STATIC_ROOT` - путь для обработки файлов `/static`

### Переменные окружения для работы с БД Mongo

* `MONGO_DB` - название коллекции в БД Mongo. Для этого сервиса в файле прописана `readme-file-vault`.
* `MONGO_HOST` - название сервера БД Mongo. В файле прописано `mongodb`, что совпадает с названием сервиса описанного в `project/docker-compose.yml` файле.
* `MONGO_PORT` - номер порта по которому сервис будет соеденяться с БД Mongo. В файле установлен в `27017`, что совпадает с конфигурацией сервиса `mongodb` описанного в `project/docker-compose.yml` файле.
* `MONGO_USER` - имя пользователя под которым сервис будет соеденяться с БД Mongo. В файле установлен в `admin`, что совпадает с конфигурацией сервиса `mongodb` описанного в `project/docker-compose.yml` файле.
* `MONGO_PASSWORD` - пароль пользователя под которым сервис будет соеденяться с БД Mongo. В файле установлен в `admin`, что совпадает с конфигурацией сервиса `mongodb` описанного в `project/docker-compose.yml` файле.
* `MONGO_AUTH_BASE` - имя коллекции под которой сервис будет соеденяться с БД Mongo. В файле установлен в `admin`, что совпадает с конфигурацией сервиса `mongodb` описанного в `project/docker-compose.yml` файле.

<a name="notify-config"/>

# Notify

Пример всех необходимых переменных окружений находится в файле `project/apps/notify/.env-example`. Для работы приложения нужно создать файл `project/apps/notify/notify.env` и можно скопировать данные в него из файла `project/apps/notify/.env-example`. 

### Переменные окружения для запуска Notify сервиса

* `NOTIFY_PORT` - номер порта на котором будет запущено приложение. В файле установлен в `3004`
* `NOTIFY_ENVIRONMENT` - тип окружения. В файле установлен в `development`. Есть еще `production` и `stage`

### Переменные окружения для работы с БД Mongo

* `MONGO_DB` - название коллекции в БД Mongo. Для этого сервиса в файле прописана `readme-notify`.
* `MONGO_HOST` - название сервера БД Mongo. В файле прописано `mongodb`, что совпадает с названием сервиса описанного в `project/docker-compose.yml` файле.
* `MONGO_PORT` - номер порта по которому сервис будет соеденяться с БД Mongo. В файле установлен в `27017`, что совпадает с конфигурацией сервиса `mongodb` описанного в `project/docker-compose.yml` файле.
* `MONGO_USER` - имя пользователя под которым сервис будет соеденяться с БД Mongo. В файле установлен в `admin`, что совпадает с конфигурацией сервиса `mongodb` описанного в `project/docker-compose.yml` файле.
* `MONGO_PASSWORD` - пароль пользователя под которым сервис будет соеденяться с БД Mongo. В файле установлен в `admin`, что совпадает с конфигурацией сервиса `mongodb` описанного в `project/docker-compose.yml` файле.
* `MONGO_AUTH_BASE` - имя коллекции под которой сервис будет соеденяться с БД Mongo. В файле установлен в `admin`, что совпадает с конфигурацией сервиса `mongodb` описанного в `project/docker-compose.yml` файле.

### Переменные окружения для работы с RabbitMQ

* `RABBIT_HOST` - название сервера RabbitMQ. В файле прописано `rabbitmq`, что совпадает с названием сервиса описанного в `project/docker-compose.yml` файле.
* `RABBIT_PORT` - номер порта по которому сервис будет соеденяться с RabbitMQ. В файле установлен в `5672`, что совпадает с конфигурацией сервиса `rabbitmq` описанного в `project/docker-compose.yml` файле.
* `RABBIT_USER` - имя пользователя под которым сервис будет соеденяться с RabbitMQ. В файле установлен в `admin`, что совпадает с конфигурацией сервиса `rabbitmq` описанного в `project/docker-compose.yml` файле.
* `RABBIT_PASSWORD` - пароль пользователя под которым сервис будет соеденяться с RabbitMQ. В файле установлен в `admin`, что совпадает с конфигурацией сервиса `rabbitmq` описанного в `project/docker-compose.yml` файле.
* `RABBIT_QUEUE` - название очереди
* `RABBIT_EXCHANGE` - название exchange

### Переменные окружения для работы с SMTP сервером

* `MAIL_SMTP_HOST` - название сервера SMTP. В файле прописано `fakesmtp`, что совпадает с названием сервиса описанного в `project/docker-compose.yml` файле.
* `MAIL_SMTP_PORT` - номер порта по которому сервис будет соеденяться с SMTP. В файле установлен в `8025`, что совпадает с конфигурацией сервиса `fakesmtp` описанного в `project/docker-compose.yml` файле.
* `MAIL_SMTP_USER_NAME` - имя пользователя под которым сервис будет соеденяться с SMTP. В файле установлен в `admin`, что совпадает с конфигурацией сервиса `fakesmtp` описанного в `project/docker-compose.yml` файле.
* `MAIL_SMTP_USER_PASSWORD` - пароль пользователя под которым сервис будет соеденяться с SMTP. В файле установлен в `admin`, что совпадает с конфигурацией сервиса `fakesmtp` описанного в `project/docker-compose.yml` файле.
* `MAIL_SMTP_FROM` - емейл отправителя. Установлен в `john.doe@noname.com`.
