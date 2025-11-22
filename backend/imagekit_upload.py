"""
ImageKit upload utility for handling image uploads to ImageKit.io
"""

import os
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

IMAGEKIT_PRIVATE_KEY = os.getenv('VITE_IMAGEKIT_PRIVATE_KEY', '')
IMAGEKIT_PUBLIC_KEY = os.getenv('VITE_IMAGEKIT_PUBLIC_KEY', '')
IMAGEKIT_URL_ENDPOINT = os.getenv('VITE_IMAGEKIT_URL_ENDPOINT', 'https://ik.imagekit.io/makstark')

def upload_to_imagekit(file_bytes: bytes, filename: str, folder: str = 'portfolio'):
    """
    Upload image to ImageKit.io
    
    Args:
        file_bytes: Image file as bytes
        filename: Original filename
        folder: Folder path in ImageKit (default: portfolio)
    
    Returns:
        dict: Response from ImageKit containing URL and other metadata
        None: If upload fails
    """
    if not IMAGEKIT_PRIVATE_KEY:
        print("WARNING: ImageKit private key not configured")
        return None
    
    try:
        # Prepare upload URL
        upload_url = 'https://upload.imagekit.io/api/v1/files/upload'
        
        # Encode private key for basic auth
        auth = (IMAGEKIT_PRIVATE_KEY, '')
        
        # Prepare file for upload
        # Note: customMetadata must be a JSON string, not 'false', so we omit it
        files = {
            'file': (filename, file_bytes),
            'fileName': (None, filename),
            'folder': (None, f'/portfolio/{folder}'),
            'useUniqueFileName': (None, 'true'),
            'tags': (None, 'portfolio,user-upload'),
            'isPrivateFile': (None, 'false'),
        }
        
        # Make request
        response = requests.post(upload_url, files=files, auth=auth, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            return {
                'url': data.get('url'),
                'fileId': data.get('fileId'),
                'fileName': data.get('name'),
                'filePath': data.get('filePath'),
                'width': data.get('width'),
                'height': data.get('height'),
            }
        else:
            print(f"ImageKit upload error: {response.status_code} - {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"ImageKit upload request error: {e}")
        return None
    except Exception as e:
        print(f"ImageKit upload error: {e}")
        return None


def upload_base64_to_imagekit(base64_string: str, filename: str, folder: str = 'portfolio'):
    """
    Upload base64 encoded image to ImageKit.io
    
    Args:
        base64_string: Base64 encoded image (with or without data: prefix)
        filename: Original filename
        folder: Folder path in ImageKit
    
    Returns:
        dict: Response from ImageKit or None if failed
    """
    try:
        # Remove data: prefix if present
        if base64_string.startswith('data:'):
            base64_string = base64_string.split(',')[1]
        
        # Decode base64 to bytes
        file_bytes = base64.b64decode(base64_string)
        
        # Upload to ImageKit
        return upload_to_imagekit(file_bytes, filename, folder)
        
    except Exception as e:
        print(f"Base64 decode error: {e}")
        return None
