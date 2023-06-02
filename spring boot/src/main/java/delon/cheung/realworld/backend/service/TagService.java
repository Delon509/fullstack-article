package delon.cheung.realworld.backend.service;



import delon.cheung.realworld.backend.model.Tag;
import delon.cheung.realworld.backend.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TagService {
    @Autowired
    TagRepository tagRepository;

    public Object getAllTags(){
        System.out.println("getAllTags function:");
        Map<String, Object> result = new HashMap<>();
        List<Tag> tagList = tagRepository.findAll();
        result.put("tags",tagsToListString(tagList));
        return result;
    }


    public List<String> tagsToListString(List<Tag> tags){
        List<String> result = new ArrayList<>();
        for(Tag temp : tags){
            result.add(temp.getName());
        }
        return result;
    }
}
