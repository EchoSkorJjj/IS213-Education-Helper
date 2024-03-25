def prepare_insert_flashcard_statement(session, keyspace):
    return session.prepare(f'INSERT INTO {keyspace}.flashcard (id, answer, question) VALUES (?, ?, ?)')

def prepare_insert_mcq_statement(session, keyspace):
    return session.prepare(f'INSERT INTO {keyspace}.mcq (id, question, options, multiple_answers) VALUES (?, ?, ?, ?)')

def prepare_insert_contents_to_note_statement(session, keyspace):
    return session.prepare(f'INSERT INTO {keyspace}.contents_to_note (note_id, content_id, content_type) VALUES (?, ?, ?)')

def prepare_select_all_contents_by_note_id_statement(session, keyspace):
    return session.prepare(f'SELECT * FROM {keyspace}.contents_to_note WHERE note_id=?')

def prepare_select_content_by_id_statement(session, keyspace, table):
    return session.prepare(f'SELECT * FROM {keyspace}.{table} WHERE id=?')