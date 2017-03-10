package cz.kartrace.kartchamp.web.management;

import cz.kartrace.kartchamp.dao.TeamDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * @author hradecky
 */
@Controller
public class SeasonController {
    @Autowired
    private TeamDao teamDao;

    @RequestMapping("/management/season")
    public String index(@RequestParam(value="name", required=false, defaultValue="World") String name, Model model) {
        model.addAttribute("name", name);
        return "management/season";
    }

}
