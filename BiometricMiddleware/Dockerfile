# middleware/Dockerfile

# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia o projeto e restaura dependências
COPY *.csproj .
RUN dotnet restore

# Copia o resto do código e a DLL externa
COPY . .
COPY ../../../Downloads/zkfinger_sdk_v10.0-windows-lite-zk9500/ZKFinger\ SDK\ V10.0-Windows-Lite/C#/lib/x64/libzkfpcsharp.dll ./dlls/

# Compila a aplicação
RUN dotnet publish -c Release -o /app

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copia a DLL externa para o runtime
COPY --from=build /src/dlls/libzkfpcsharp.dll ./dlls/

# Copia a aplicação compilada
COPY --from=build /app ./

ENTRYPOINT ["dotnet", "Middleware.dll"]