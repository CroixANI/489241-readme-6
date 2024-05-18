# Сервисы

```mermaid
flowchart TD
    U["fa:fa-user User"]
    U-->FE[Front-End]
    FE-->API[API Gateway]
    API-->B[Blog]
    API-->A[Account]
    API-->MQ[(RabbitMQ)]
    A-->M[(MongoDB)]
    B-->P[(PostgreSQK)]
    MQ-->N[Notify]
    N-->SMTP[(Email)]
```

# Как запустить в Dev Container (быстрый выриант)

[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/htmlacademy-nestjs/489241-readme-6)

☝️ Нажать на "DevContainers Open" ☝️

![Run in Dev Container](./images/01-run-in-dev-container.png)

# Как запустить через `docker compose`
Более детально про другие варианты запуска приложений тут [How to Run Applications](./how-to/1-How-to-Run-Applications.md). Там описано
* Переменные окружения
* Как запускать `docker compose` файл
* Как запускать приложения

# Как соедениться с БД
Тут [How to Connect to Database](./how-to/2-How-to-Connect-to-Databases) можно узнать как соедениться с БДых после запуска приложений.
