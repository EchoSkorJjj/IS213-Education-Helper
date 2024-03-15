import pb.contents_pb2 as contents_pb2

import src.utils.error_utils as error_utils

def get_mcq_key(note_id: str) -> str:
    return f"{note_id}:mcqs"

def mcq_has_missing_fields(mcq: dict) -> bool:
    if any([not mcq[field] for field in mcq if not isinstance(mcq[field], bool)]):
        return True
    
    for option in mcq['options']:
        for field in option:
            # Don't simplify for earlier stop to evaluation
            if not isinstance(option[field], bool) and not option[field]:
                return True
    
    return False

def construct_mcq(req) -> object:
    try:
        num_correct = 0
        mcq_obj = {
            'question': req.question,
            'options': []
        }

        for option in req.options:
            if option.is_correct:
                num_correct += 1
            mcq_obj['options'].append({
                'option': option.option,
                'is_correct': option.is_correct
            })
        
        if num_correct == 0:
            raise ValueError("No correct option found")
        
        mcq_obj['multiple_answers'] = num_correct > 1
        return mcq_obj
    except Exception as e:
        raise e

def object_to_grpc_mcq(obj):
    mcq = contents_pb2.MultipleChoiceQuestion()

    try:
        mcq.id = obj['id']
        mcq.note_id = obj['note_id']
        mcq.question = obj['question']
        mcq.multiple_answers = obj['multiple_answers']

        for option in obj['options']:
            mcq.options.append(object_to_grpc_mcq_option(option))        

        return mcq
    except KeyError as e:
        raise error_utils.construct_key_error(e)

def object_to_grpc_mcq_option(obj):
    mcq_option = contents_pb2.MultipleChoiceQuestionOption()

    try:
        mcq_option.option = obj['option']
        mcq_option.is_correct = obj['is_correct']
        
        return mcq_option
    except KeyError as e:
        raise e # raise e because wrapper function will handle it
    