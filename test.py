from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# Authentifizierung mit OAuth 2.0
flow = InstalledAppFlow.from_client_secrets_file('client_secret.json', ['https://www.googleapis.com/auth/calendar'])
credentials = flow.run_local_server(port=0)

# Erstellen einer Google Calendar API-Instanz
service = build('calendar', 'v3', credentials=credentials)

# Beispiel: Abrufen der nächsten zehn Ereignisse aus dem primären Kalender
events_result = service.events().list(calendarId='primary', maxResults=10, singleEvents=True, orderBy='startTime').execute()
events = events_result.get('items', [])

if not events:
    print('Keine bevorstehenden Ereignisse gefunden.')
for event in events:
    start = event['start'].get('dateTime', event['start'].get('date'))
    print(f'{start} - {event["summary"]}')
