FROM public.ecr.aws/lambda/python:3.13

# Install Poetry
RUN pip install poetry

# Copy only pyproject.toml and poetry.lock (if exists) to cache dependencies
COPY pyproject.toml poetry.lock* ./

# Disable virtualenvs created by Poetry as it's not needed in Docker
# and install dependencies based on the pyproject.toml file
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi --no-root

# Copy app code
COPY . .

# Set the handler
CMD ["api.main.lambda_handler"]