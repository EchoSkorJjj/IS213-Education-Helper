# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install any needed packages specified in requirements.txt
# Copy only the requirements.txt first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# It's a good practice to expose the port your app runs on. 
# This does not actually publish the port but serves as documentation.
EXPOSE 50052

# Run note_upload_service.py when the container launches
CMD ["python3", "note_upload_service.py"]
