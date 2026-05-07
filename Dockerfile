# syntax=docker/dockerfile:1.7

# ===== Stage 1: build frontend (Vite) =====
FROM node:20-alpine AS frontend
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ===== Stage 2: build backend JAR with frontend bundled into static/ =====
FROM eclipse-temurin:17-jdk AS backend
WORKDIR /app
COPY backend/gradlew backend/settings.gradle backend/build.gradle ./
COPY backend/gradle ./gradle
RUN chmod +x ./gradlew
COPY backend/src ./src
COPY --from=frontend /app/dist ./src/main/resources/static
RUN ./gradlew --no-daemon bootJar -x test

# ===== Stage 3: runtime =====
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend /app/build/libs/*.jar app.jar
ENV JAVA_TOOL_OPTIONS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=70"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
