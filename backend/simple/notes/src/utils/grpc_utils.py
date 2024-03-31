import notes_pb2

def note_model_to_message(note_as_model):
    return notes_pb2.Note(
        userId=note_as_model.user_id,
        fileId=str(note_as_model.id),
        fileName=note_as_model.file_name,
        title=note_as_model.title,
        topic=note_as_model.topic,
        generateType=note_as_model.generate_type,
    )