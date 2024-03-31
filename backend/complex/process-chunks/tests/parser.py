import json
import logging
import re
def preprocess_json_string(response_string):
    # Fix missing commas between key-value pairs within the same object
    # Targets end of a string value or object/array followed by a key without an intervening comma
    response_string = re.sub(r'(?<=[}\]"0-9])\s*(?="{)', ',', response_string)
    
    formatted_response = re.sub(r',\s*}', '}', response_string)
    formatted_response = re.sub(r'}\s*{', '},{', formatted_response)
    formatted_response = re.sub(r'^\[\s*', '', formatted_response)
    formatted_response = re.sub(r'\s*\]$', '', formatted_response)
    formatted_response = re.sub(r'(?<=[}\]"0-9])\s+(?=")', ', ', formatted_response)

    # Normalize object boundaries to ensure they can be correctly identified
    formatted_response = re.sub(r',\s*}', '}', formatted_response)
    formatted_response = re.sub(r'}\s*{', '},{', formatted_response)
    formatted_response = re.sub(r'"\s*\n\s*"', '",\n"', formatted_response)

    return formatted_response

def extract_and_validate_json_objects(response_string):
    response_string = preprocess_json_string(response_string)

    objects = []
    obj_start = 0
    depth = 0
    in_string = False
    escape = False

    # Iterate over the response string character by character
    for i, char in enumerate(response_string):
        if char == '"' and not escape:
            in_string = not in_string
        elif char in ['{', '['] and not in_string:
            if depth == 0:
                obj_start = i
            depth += 1
        elif char in ['}', ']'] and not in_string:
            depth -= 1
            if depth == 0 and obj_start is not None:
                try:
                    obj = json.loads(response_string[obj_start:i+1])
                    objects.append(obj)
                except json.JSONDecodeError as e:
                    logging.error(f"JSON parsing error: {e} at position {i}")
        elif char == '\\' and in_string:
            escape = not escape
        else:
            escape = False

    return objects

def format_as_json_array(valid_objects):
    return json.dumps(valid_objects, indent=2)

case_1 = """
{
    "question": "What is the significance of the Action Plan for Successful Ageing?",
    "answer": "The Action Plan for Successful Ageing is significant because it is a collective effort to support Singaporeans in aging well. It aims to empower seniors to take care of their physical and mental well-being, enable them to continue contributing to society, and support them in staying connected to their loved ones and society. The plan also considers new realities and opportunities brought about by the COVID-19 pandemic."
},
{
    "question": "What are the three thrusts of the 2023 Action Plan for Successful Ageing?",
    "answer": "The three thrusts of the 2023 Action Plan for Successful Ageing are empowering seniors to take care of their physical and mental well-being, enabling them to continue contributing their knowledge and expertise, and supporting them to stay connected to their loved ones and society."
},
{
    "question": "What are some initiatives to support healthcare and aged care in communities according to the Action Plan?",
    "answer": "According to the Action Plan, there are initiatives to support healthcare and aged care in communities. Some of these initiatives include emphasizing preventive care through Healthier SG, building up a national system to support aged care in communities, and providing support networks including digital platforms to help seniors stay connected."
},
{
    "question": "What is the estimated proportion of seniors aged 65 and above in the population by 2030?",
    "answer": "By 2030, it is estimated that 1 in 4 Singapore citizens will be aged 65 and above."
},
{
    "question": "What is the estimated proportion of seniors living alone by 2030?",
    "answer": "By 2030, it is estimated that about 1 in 4 seniors will live alone."
},
{
    "question": "What is the estimated proportion of seniors with at least mild disability by 2030?",
    "answer": "By 2030, it is estimated that 2.7% of seniors will have at least mild disability, requiring assistance with at least 1 activity of daily living."
},
{
    "question": "What are some initiatives to support seniors' health and active aging?",
    "answer": "Some initiatives to support seniors' health and active aging include providing health talks and exercise programs through the National Seniors' Health Programme, offering job redesign grants to encourage mature workers aged 50 and above to benefit from them, and offering courses under the National Silver Academy for seniors to learn new skills."
},
{
    "question": "What are some initiatives to support caregiving and dementia management?",
    "answer": "Some initiatives to support caregiving and dementia management include establishing dementia-friendly communities, co-locating senior care centers with childcare centers to provide opportunities for interactions between seniors and children, and strengthening caregiver support."
},
{
    "question": "What are some initiatives to support seniors' contribution to society?",
    "answer": "Some initiatives to support seniors' contribution to society include promoting remaining in productive employment, enhancing retirement readiness, encouraging volunteering and giving back to society, and providing opportunities for active aging through learning."
},
{
    "question": "What are some initiatives to support seniors' connectedness?",
    "answer": "Some initiatives to support seniors' connectedness include offering low-income seniors heavily subsidized smartphones and mobile plans, providing digital literacy training under the Seniors Go Digital program, and nurturing loving families and inter-generational bonds."
},
{
    "question": "What are some initiatives to support seniors in staying independent and living within the community?",
    "answer": "Some initiatives to support seniors in staying independent and living within the community include offering barrier-free public transportation and wheelchair accessibility, establishing senior care centers in communities, and providing support for seniors' safety and well-being."
},
{
    "question": "What are some initiatives to support seniors in facing age-related challenges?",
    "answer": "Some initiatives to support seniors in facing age-related challenges include addressing declining physical and mental health, tackling ageist attitudes and stereotypes, and providing support to cope with rising cost of living and inflation."
},
{
    "question": "What is the significance of co-creating the refreshed Action Plan with Singaporeans?",
    "answer": "Co-creating the refreshed Action Plan with Singaporeans allows for a diversity of perspectives and ensures that the plan caters to the worries, aspirations, and needs of seniors today and tomorrow. It also encourages active involvement and ownership in shaping the policies and initiatives."
},
{
    "question": "What is the Citizens' Panel on Contribution and its purpose?",
    "answer": "The Citizens' Panel on Contribution is a group of 46 Singaporeans selected through an open call to propose innovative ideas on how seniors can continue contributing at the workplace and in the community. Their purpose is to enable seniors to continue sharing their knowledge and expertise in their golden years by addressing issues faced and recommending solutions."
},
{
    "question": "What are some methods used to gather feedback and input for the refreshed Action Plan?",
    "answer": "Some methods used to gather feedback and input for the refreshed Action Plan include conducting focus group discussions, collecting social media entries and opinions, surveying the public, and forming the Citizens' Panel on Contribution."
},
{
    "question": "What are some challenges and concerns commonly raised by Singaporeans regarding aging?",
    "answer": "Some challenges and concerns commonly raised by Singaporeans regarding aging include emotional and financial stress due to caregiving responsibilities, low awareness on mental health issues, declining physical and mental health, coping with inflation and cost of living during retirement, inadequate savings for healthcare, difficulty in finding jobs, and fear of being left behind or disconnected."
},
{
    "question": "What are some initiatives taken during the COVID-19 pandemic to support seniors?",
    "answer": "During the COVID-19 pandemic, initiatives were taken to support seniors including checking in on vulnerable seniors through phone calls and house visits, delivering meals to seniors who could not leave their homes, providing mobile phones and plans to vulnerable seniors, and engaging seniors to stay home and reduce their risk of infection."
},
{
    "question": "What is the significance of the united response to the pandemic for society's approach to aging?",
    "answer": "The united response to the pandemic demonstrates that everyone has a part to play in supporting seniors and aging well. It serves as a foundation for how society approaches aging moving forward, highlighting the importance of solidarity, care, and support for seniors."
},
{
    "question": "What is the significance of demographic and technological trends in the context of successful aging?",
    "answer": "Demographic and technological trends, such as the aging population and increasing smartphone and internet usage among seniors, have implications for successful aging. These trends provide opportunities for longer years of active engagement, good health, and contribution to society. They also call for initiatives and support systems that cater to seniors' evolving needs and enable them to stay connected and engaged in the digital age."
},
{
    "question": "What is the significance of the average health-adjusted life expectancy for seniors?",
    "answer": "The average health-adjusted life expectancy, which has been increasing, reflects the number of years that a person can expect to live in full health without disability. This is significant as it indicates the potential for seniors to lead healthy and active lives, and highlights the importance of promoting preventive care and measures to maintain good health and well-being."
},
{
    "question": "What are some initiatives to support seniors in embracing technology and staying connected digitally?",
    "answer": "Some initiatives to support seniors in embracing technology and staying connected digitally include offering heavily subsidized smartphones and mobile plans, providing digital literacy training through programs like Seniors Go Digital, and offering support and resources to ensure seniors can utilize digital platforms for communication and engagement."
},
{
    "question": "What are some initiatives to support seniors in staying mentally and emotionally well?",
    "answer": "Some initiatives to support seniors in staying mentally and emotionally well include raising awareness on mental health issues, providing resources and support for seniors with mental health conditions, facilitating social and community engagement to combat isolation and loneliness, and promoting continuous learning and engagement in meaningful activities."
    
"""
case_2 = """
{
    "name": "John Doe"
    "age": 30
}
"""
case_3 = """

{
    "name": "Jane Doe",
    "age": 25,
}

"""
case_4 = """
{
    "users": ["John Doe", "Jane Doe"]
    "admin": "Michael Smith"
}
"""

case_5 = """
{
    "users": ["John Doe", "Jane Doe"]
    "admin": "Michael
"""

case_6 = """
{
    "users": ["John Doe", "Jane Doe"]
    "admin": "Michael"
"""

case_7 = """
{
    "users": ["John Doe", "Jane Doe"]
"""

valid_objects = extract_and_validate_json_objects(case_7)
json_array_string = format_as_json_array(valid_objects)

print(json_array_string)
