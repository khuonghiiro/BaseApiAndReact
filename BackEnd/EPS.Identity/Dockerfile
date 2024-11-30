#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 9901
EXPOSE 6001

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR .
COPY ./EPS.Identity/NuGet.Config .
COPY ["EPS.Identity/EPS.Identity.csproj", "EPS.Identity/"]
RUN dotnet restore "./EPS.Identity/EPS.Identity.csproj"
COPY . .
WORKDIR "./EPS.Identity"
RUN dotnet build "./EPS.Identity.csproj" -c $BUILD_CONFIGURATION -o /app/build
RUN rm ./EPS.Identity/NuGet.Config

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./EPS.Identity.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EPS.Identity.dll"]
