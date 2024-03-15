import grpc

import pb.contents_pb2 as contents_pb2
import pb.contents_pb2_grpc as contents_pb2_grpc

from src.connection import database, cache
import src.utils.grpc_utils as grpc_utils
import src.utils.error_utils as error_utils
import src.utils.flashcard_utils as flashcard_utils
import src.utils.mcq_utils as mcq_utils

class ContentServicer(contents_pb2_grpc.ContentServicer):
    def CreateTemporaryFlashcard(self, request, context):
        response = contents_pb2.CreateTemporaryFlashcardResponse()
        temp_store = cache.Cache()
        try:
            note_id = request.note_id
            temp_store_key = flashcard_utils.get_flashcard_key(note_id)
            flashcard_object = flashcard_utils.construct_flashcard(request)
            if flashcard_utils.flashcard_has_missing_fields(flashcard_object):
                raise ValueError('Missing fields in flashcard object')

            flashcard_object = temp_store.create_object(temp_store_key, flashcard_object)
            transformed_flashcard = flashcard_utils.object_to_grpc_flashcard({'note_id': note_id, **flashcard_object})
            
            response_metadata = grpc_utils.create_response_metadata(context)
            response = contents_pb2.CreateTemporaryFlashcardResponse()
            response.metadata.CopyFrom(response_metadata)
            response.flashcard.CopyFrom(transformed_flashcard)

            return response
        except Exception as e:
            error_utils.handle_error(
                context,
                'Error creating temporary flashcard',
                grpc.StatusCode.INVALID_ARGUMENT,
                e
            )

    def CreateTemporaryMultipleChoiceQuestion(self, request, context):
        response = contents_pb2.CreateTemporaryMultipleChoiceQuestionResponse()
        temp_store = cache.Cache()
        try:
            note_id = request.note_id
            temp_store_key = mcq_utils.get_mcq_key(note_id)
            mcq_object = mcq_utils.construct_mcq(request)
            if mcq_utils.mcq_has_missing_fields(mcq_object):
                raise ValueError('Missing fields in mcq object')

            mcq_object = temp_store.create_object(temp_store_key, mcq_object)
            transformed_mcq = mcq_utils.object_to_grpc_mcq({'note_id': note_id, **mcq_object})
            
            response_metadata = grpc_utils.create_response_metadata(context)
            response = contents_pb2.CreateTemporaryMultipleChoiceQuestionResponse()
            response.metadata.CopyFrom(response_metadata)
            response.mcq.CopyFrom(transformed_mcq)

            return response
        except Exception as e:
            error_utils.handle_error(
                context,
                'Error creating temporary MCQ',
                grpc.StatusCode.INVALID_ARGUMENT,
                e
            )

    def UpdateTemporaryFlashcard(self, request, context):
        response = contents_pb2.UpdateTemporaryFlashcardResponse()
        temp_store = cache.Cache()
        try:
            note_id = request.note_id
            temp_id = request.id
            temp_store_key = flashcard_utils.get_flashcard_key(note_id)

            flashcard_object = flashcard_utils.construct_flashcard(request)
            flashcard_object = temp_store.update_object_by_id(temp_store_key, temp_id, flashcard_object)
            transformed_flashcard = flashcard_utils.object_to_grpc_flashcard({'note_id': note_id, **flashcard_object})
            
            response_metadata = grpc_utils.create_response_metadata(context)
            response = contents_pb2.UpdateTemporaryFlashcardResponse()
            response.metadata.CopyFrom(response_metadata)
            response.flashcard.CopyFrom(transformed_flashcard)

            return response
        except Exception as e:
            error_utils.handle_error(
                context,
                'Error creating updating temporary flashcard',
                grpc.StatusCode.INVALID_ARGUMENT,
                e
            )

    def UpdateTemporaryMultipleChoiceQuestion(self, request, context):
        response = contents_pb2.UpdateTemporaryMultipleChoiceQuestionResponse()
        temp_store = cache.Cache()
        try:
            note_id = request.note_id
            temp_id = request.id
            temp_store_key = mcq_utils.get_mcq_key(note_id)

            mcq_object = mcq_utils.construct_mcq(request)
            mcq_object = temp_store.update_object_by_id(temp_store_key, temp_id, mcq_object)
            transformed_mcq = mcq_utils.object_to_grpc_mcq({'note_id': note_id, **mcq_object})
            
            response_metadata = grpc_utils.create_response_metadata(context)
            response = contents_pb2.UpdateTemporaryMultipleChoiceQuestionResponse()
            response.metadata.CopyFrom(response_metadata)
            response.mcq.CopyFrom(transformed_mcq)

            return response
        except Exception as e:
            error_utils.handle_error(
                context,
                'Error creating updating temporary MCQ',
                grpc.StatusCode.INVALID_ARGUMENT,
                e
            )

    def DeleteTemporaryFlashcard(self, request, context):
        response = contents_pb2.DeleteTemporaryFlashcardResponse()
        temp_store = cache.Cache()
        try:
            note_id = request.note_id
            temp_id = request.id
            temp_store_key = flashcard_utils.get_flashcard_key(note_id)

            flashcard_object = temp_store.delete_object_by_id(temp_store_key, temp_id)
            transformed_flashcard = flashcard_utils.object_to_grpc_flashcard({'note_id': note_id, **flashcard_object})
            
            response_metadata = grpc_utils.create_response_metadata(context)
            response = contents_pb2.DeleteTemporaryFlashcardResponse()
            response.metadata.CopyFrom(response_metadata)
            response.flashcard.CopyFrom(transformed_flashcard)

            return response
        except Exception as e:
            error_utils.handle_error(
                context,
                'Error creating deleting temporary flashcard',
                grpc.StatusCode.INVALID_ARGUMENT,
                e
            )

    def DeleteTemporaryMultipleChoiceQuestion(self, request, context):
        response = contents_pb2.DeleteTemporaryMultipleChoiceQuestionResponse()
        temp_store = cache.Cache()
        try:
            note_id = request.note_id
            temp_id = request.id
            temp_store_key = mcq_utils.get_mcq_key(note_id)

            mcq_object = temp_store.delete_object_by_id(temp_store_key, temp_id)
            transformed_mcq = mcq_utils.object_to_grpc_mcq({'note_id': note_id, **mcq_object})
            
            response_metadata = grpc_utils.create_response_metadata(context)
            response = contents_pb2.DeleteTemporaryMultipleChoiceQuestionResponse()
            response.metadata.CopyFrom(response_metadata)
            response.mcq.CopyFrom(transformed_mcq)

            return response
        except Exception as e:
            error_utils.handle_error(
                context,
                'Error creating deleting temporary MCQ',
                grpc.StatusCode.INVALID_ARGUMENT,
                e
            )

    def GetAllTemporaryContents(self, request, context):
        response = contents_pb2.GetAllTemporaryContentsResponse()
        temp_store = cache.Cache()
        try:
            note_id = request.note_id
            temp_store_key_flashcards = flashcard_utils.get_flashcard_key(note_id)
            temp_store_key_mcqs = mcq_utils.get_mcq_key(note_id)
            flashcards = temp_store.get_all_by_key(temp_store_key_flashcards)
            mcqs = temp_store.get_all_by_key(temp_store_key_mcqs)

            transformed_flashcards = [flashcard_utils.object_to_grpc_flashcard({'note_id': note_id, **flashcard}) for flashcard in flashcards]
            transformed_mcqs = [mcq_utils.object_to_grpc_mcq({'note_id': note_id, **mcq}) for mcq in mcqs]
            
            response_metadata = grpc_utils.create_response_metadata(context)
            response.metadata.CopyFrom(response_metadata)
            response.flashcards.extend(transformed_flashcards)
            response.mcqs.extend(transformed_mcqs)

            return response
        except Exception as e:
            error_utils.handle_error(
                context,
                'Error getting all temporary contents',
                grpc.StatusCode.INVALID_ARGUMENT,
                e
            )

    def CommitTemporaryContents(self, request, context):
        # TODO: Implement this method
        pass

    def GetSavedContent(self, request, context):
        # TODO: Implement this method
        pass